import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import type { OrganizationCard as OrganizationCardType } from '@/types';
import {
  MapPin,
  Monitor,
  Building2,
  Heart,
  DoorOpen,
  CircleDollarSign,
} from 'lucide-react';

interface OrganizationCardProps {
  organization: OrganizationCardType;
  className?: string;
}

// Map organization type to display label
const organizationTypeLabels: Record<string, string> = {
  community_mental_health_center: 'Community Mental Health Center',
  hospital_clinic: 'Hospital Clinic',
  nonprofit: 'Nonprofit',
  support_group: 'Support Group',
  crisis_center: 'Crisis Center',
  school_based: 'School-Based Program',
  faith_based: 'Faith-Based Organization',
  government: 'Government Program',
  private_practice_group: 'Group Practice',
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

export function OrganizationCard({ organization, className }: OrganizationCardProps) {
  // Format service formats for display
  const hasInPerson = organization.service_formats.some(f => f === 'in_person' || f === 'hybrid');
  const hasOnline = organization.service_formats.some(f => f === 'telehealth' || f === 'phone' || f === 'hybrid');

  return (
    <Card variant="default" padding="md" className={cn('hover:shadow-lg transition-shadow', className)}>
      <div className="flex gap-4">
        {/* Logo/Icon */}
        <div className="shrink-0">
          {organization.logo_url ? (
            <img
              src={organization.logo_url}
              alt=""
              className="h-14 w-14 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-support-100 text-support-600">
              <Building2 className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name and type */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 truncate">
              {organization.name}
            </h3>
            <p className="text-sm text-neutral-500">
              {organizationTypeLabels[organization.organization_type] || 'Organization'}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {organization.issues_addressed.slice(0, 3).map((issue) => (
              <Tag key={issue} variant="support" size="sm">
                {issueLabels[issue] || issue}
              </Tag>
            ))}
            {organization.issues_addressed.length > 3 && (
              <Tag variant="neutral" size="sm">
                +{organization.issues_addressed.length - 3}
              </Tag>
            )}
          </div>

          {/* Location and format */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
            {organization.neighborhood && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-neutral-400" />
                {organization.neighborhood}
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

          {/* Special badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            {organization.is_free && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-100 px-2.5 py-1 text-xs font-medium text-success-700">
                <CircleDollarSign className="h-3.5 w-3.5" />
                Free services
              </span>
            )}
            {organization.accepts_walk_ins && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700">
                <DoorOpen className="h-3.5 w-3.5" />
                Walk-ins welcome
              </span>
            )}
          </div>

          {/* Services summary */}
          {organization.services_summary.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-neutral-600">
                Services: {organization.services_summary.join(', ')}
              </p>
            </div>
          )}

          {/* Description excerpt */}
          {organization.description_excerpt && (
            <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
              {organization.description_excerpt}
            </p>
          )}

          {/* Payment info */}
          {!organization.is_free && organization.payment_summary && (
            <p className="mt-2 text-sm text-neutral-500">
              {organization.payment_summary}
            </p>
          )}

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2">
            <Link href={`/organizations/${organization.id}`} className="flex-1">
              <Button variant="primary" fullWidth>
                View details
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              aria-label="Save organization"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
