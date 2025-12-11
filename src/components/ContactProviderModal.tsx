'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle2 } from 'lucide-react';

interface ContactProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  providerName: string;
  providerEmail: string;
}

export function ContactProviderModal({
  isOpen,
  onClose,
  providerId,
  providerName,
  providerEmail,
}: ContactProviderModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          providerEmail,
          senderName: name,
          senderEmail: email,
          senderPhone: phone,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {success ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Message Sent!</h3>
            <p className="text-neutral-600">
              {providerName} will receive your message and contact you at {email}.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 rounded-t-2xl">
              <h2 className="text-xl font-semibold text-white">
                Contact {providerName}
              </h2>
              <p className="mt-1 text-sm text-primary-50">
                Send a direct message and they'll respond to you via email.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="rounded-lg bg-error-50 border border-error-200 p-3 text-sm text-error-700">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Your name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="block h-11 w-full rounded-lg border border-neutral-300 px-3.5 text-base placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="block h-11 w-full rounded-lg border border-neutral-300 px-3.5 text-base placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                  className="block h-11 w-full rounded-lg border border-neutral-300 px-3.5 text-base placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell them a bit about what you're looking for..."
                  rows={4}
                  required
                  className="block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-base placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-colors resize-none"
                />
              </div>

              <p className="flex items-start gap-2 text-xs text-neutral-500 pt-1">
                <Shield className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5" />
                Your information is only shared with {providerName}. We don't sell or share your data.
              </p>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send message'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
