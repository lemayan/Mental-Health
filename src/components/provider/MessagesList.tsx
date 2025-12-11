'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MailOpen, Phone, Calendar, CheckCircle2 } from 'lucide-react';

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  created_at: string;
}

interface MessagesListProps {
  providerId: string;
}

export function MessagesList({ providerId }: MessagesListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [providerId]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/provider/messages?provider_id=${providerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch('/api/provider/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, is_read: true }),
      });

      if (!response.ok) throw new Error('Failed to mark as read');

      setMessages(prev =>
        prev.map(msg => msg.id === messageId ? { ...msg, is_read: true } : msg)
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAsReplied = async (messageId: string) => {
    try {
      const response = await fetch('/api/provider/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, is_replied: true }),
      });

      if (!response.ok) throw new Error('Failed to mark as replied');

      setMessages(prev =>
        prev.map(msg => msg.id === messageId ? { ...msg, is_replied: true } : msg)
      );
    } catch (err) {
      console.error('Error marking as replied:', err);
    }
  };

  const handleExpand = (messageId: string) => {
    if (expandedId === messageId) {
      setExpandedId(null);
    } else {
      setExpandedId(messageId);
      const message = messages.find(m => m.id === messageId);
      if (message && !message.is_read) {
        markAsRead(messageId);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} padding="lg" className="animate-pulse">
            <div className="h-20 bg-neutral-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card padding="lg">
        <p className="text-error-600 text-center">{error}</p>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <Mail className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          No messages yet
        </h3>
        <p className="text-neutral-600">
          When users contact you through your profile, messages will appear here.
        </p>
      </Card>
    );
  }

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Messages</h2>
          <p className="text-sm text-neutral-600 mt-1">
            {messages.length} total message{messages.length !== 1 ? 's' : ''}
            {unreadCount > 0 && (
              <span className="ml-2 text-primary-600 font-medium">
                • {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.map((message) => {
          const isExpanded = expandedId === message.id;
          
          return (
            <Card
              key={message.id}
              padding="lg"
              className={`cursor-pointer transition-all ${
                !message.is_read ? 'border-primary-300 bg-primary-50/30' : ''
              } ${isExpanded ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => handleExpand(message.id)}
            >
              {/* Message Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`mt-1 ${!message.is_read ? 'text-primary-600' : 'text-neutral-400'}`}>
                    {message.is_read ? (
                      <MailOpen className="h-5 w-5" />
                    ) : (
                      <Mail className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold truncate ${
                        !message.is_read ? 'text-neutral-900' : 'text-neutral-700'
                      }`}>
                        {message.sender_name}
                      </h3>
                      {message.is_replied && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          Replied
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-neutral-600">
                      <span className="truncate">{message.sender_email}</span>
                      <span className="text-neutral-400">•</span>
                      <span className="whitespace-nowrap flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(message.created_at)}
                      </span>
                    </div>

                    {!isExpanded && (
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                        {message.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Message:</h4>
                    <p className="text-neutral-900 whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Contact Information:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-neutral-400" />
                        <a 
                          href={`mailto:${message.sender_email}`}
                          className="text-primary-600 hover:text-primary-700 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {message.sender_email}
                        </a>
                      </div>
                      {message.sender_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-neutral-400" />
                          <a 
                            href={`tel:${message.sender_phone}`}
                            className="text-primary-600 hover:text-primary-700 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {message.sender_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${message.sender_email}?subject=Re: Your inquiry`;
                        markAsReplied(message.id);
                      }}
                    >
                      Reply via Email
                    </Button>
                    {!message.is_replied && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsReplied(message.id);
                        }}
                      >
                        Mark as Replied
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
