import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import type { ProviderCard as ProviderCardType } from '@/types';
import { createClient } from '@/lib/supabase/client';
import {
  MapPin,
  Monitor,
  Building2,
  Phone,
  Heart,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
} from 'lucide-react';

interface ProviderCardProps {
  provider: ProviderCardType;
  className?: string;
}

// Map provider type to display label
const providerTypeLabels: Record<string, string> = {
  therapist: 'Therapist',
  psychiatrist: 'Psychiatrist',
  psychologist: 'Psychologist',
  counselor: 'Counselor',
  social_worker: 'Social Worker',
  nurse_practitioner: 'Nurse Practitioner',
  peer_specialist: 'Peer Specialist',
};

// Map issue types to display labels
const issueLabels: Record<string, string> = {
  anxiety: 'Anxiety',
  depression: 'Depression',
  trauma: 'Trauma',
  addiction: 'Addiction',
  stress: 'Stress',
  grief: 'Grief',
  relationship: 'Relationships',
  family: 'Family',
  child_behavior: 'Child Behavior',
  teen_issues: 'Teen Issues',
  eating_disorders: 'Eating Disorders',
  bipolar: 'Bipolar',
  ocd: 'OCD',
  ptsd: 'PTSD',
  adhd: 'ADHD',
  autism: 'Autism',
  sleep: 'Sleep',
  anger: 'Anger',
  self_esteem: 'Self-Esteem',
  life_transitions: 'Life Transitions',
  lgbtq: 'LGBTQ+',
};

// Availability status display
const availabilityConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  accepting_new_clients: {
    label: 'Accepting new clients',
    color: 'text-success-600 bg-success-100',
    icon: CheckCircle2,
  },
  waitlist: {
    label: 'Waitlist available',
    color: 'text-warning-600 bg-warning-100',
    icon: Clock,
  },
  limited_availability: {
    label: 'Limited availability',
    color: 'text-warning-600 bg-warning-100',
    icon: AlertCircle,
  },
  not_accepting: {
    label: 'Not accepting new clients',
    color: 'text-neutral-600 bg-neutral-100',
    icon: AlertCircle,
  },
};

export function ProviderCard({ provider, className }: ProviderCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

  const availability = availabilityConfig[provider.availability_status] || availabilityConfig.accepting_new_clients;
  const AvailabilityIcon = availability.icon;

  // Format service formats for display
  const hasInPerson = provider.service_formats.some(f => f === 'in_person' || f === 'hybrid');
  const hasOnline = provider.service_formats.some(f => f === 'telehealth' || f === 'phone' || f === 'hybrid');

  const handleLikeClick = async () => {
    if (liked) return; // Prevent double-clicking

    // Animate immediately for better UX
    setLiked(true);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 600);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('provider_likes')
        .insert({
          provider_id: provider.id,
          user_name: 'Anonymous User',
          user_email: 'anonymous@user.com',
          user_phone: null,
        });

      if (error) {
        console.error('Error saving like:', error);
        // Still show the animation even if save fails
      }
    } catch (error: any) {
      console.error('Error saving like:', error);
      // Still show the animation even if save fails
    }
  };

  return (
    <Card variant="default" padding="md" className={cn('hover:shadow-lg transition-shadow', className)}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {provider.photo_url ? (
            <img
              src={provider.photo_url}
              alt=""
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <span className="text-lg font-semibold">
                {provider.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name and type */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-neutral-900 truncate">
                {provider.name}
              </h3>
              {provider.average_rating && provider.review_count && provider.review_count > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-neutral-900">{provider.average_rating.toFixed(1)}</span>
                  <span className="text-neutral-500">({provider.review_count})</span>
                </div>
              )}
            </div>
            <p className="text-sm text-neutral-500">
              {providerTypeLabels[provider.provider_type] || 'Provider'}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {provider.issues_treated.slice(0, 4).map((issue) => (
              <Tag key={issue} variant="default" size="sm">
                {issueLabels[issue] || issue}
              </Tag>
            ))}
            {provider.issues_treated.length > 4 && (
              <Tag variant="neutral" size="sm">
                +{provider.issues_treated.length - 4}
              </Tag>
            )}
          </div>

          {/* Location and format */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
            {provider.neighborhood && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-neutral-400" />
                {provider.neighborhood}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              {hasInPerson && (
                <>
                  <Building2 className="h-4 w-4 text-neutral-400" />
                  <span>In-person</span>
                </>
              )}
              {hasInPerson && hasOnline && <span className="text-neutral-300">•</span>}
              {hasOnline && (
                <>
                  <Monitor className="h-4 w-4 text-neutral-400" />
                  <span>Online</span>
                </>
              )}
            </span>
          </div>

          {/* Availability */}
          <div className="mt-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                availability.color
              )}
            >
              <AvailabilityIcon className="h-3.5 w-3.5" />
              {availability.label}
              {provider.typical_wait_weeks && (
                <span className="text-neutral-500">
                  • {provider.typical_wait_weeks} week{provider.typical_wait_weeks !== 1 ? 's' : ''} wait
                </span>
              )}
            </span>
          </div>

          {/* Bio excerpt */}
          {provider.bio_excerpt && (
            <p className="mt-3 text-sm text-neutral-600 line-clamp-2">
              {provider.bio_excerpt}
            </p>
          )}

          {/* Payment info */}
          <p className="mt-2 text-sm text-neutral-500">
            {provider.payment_summary}
          </p>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2">
            <Link href={`/providers/${provider.id}`} className="flex-1">
              <Button variant="primary" fullWidth>
                View profile
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              aria-label="Like provider"
              onClick={handleLikeClick}
              disabled={liked}
              className={cn(
                "transition-all duration-300 border-2",
                likeAnimation && "scale-125 animate-bounce",
                liked ? "border-red-500 bg-red-50 hover:bg-red-100" : "border-neutral-300 hover:border-neutral-400"
              )}
            >
              <Heart 
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  liked ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "fill-none text-neutral-600"
                )} 
              />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
