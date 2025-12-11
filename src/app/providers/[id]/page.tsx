import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CrisisBanner } from '@/components/layout/crisis-banner';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { Card } from '@/components/ui/card';
import { InteractionTracker } from '@/components/InteractionTracker';
import { ContactButton } from './ContactButton';
import { ReviewsSection } from './ReviewsSection';
import {
  ArrowLeft,
  MapPin,
  Monitor,
  Building2,
  Phone,
  Globe,
  Mail,
  Clock,
  CheckCircle2,
  Shield,
  ExternalLink,
} from 'lucide-react';

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

// Age group labels
const ageGroupLabels: Record<string, string> = {
  children: 'Children (0-12)',
  teens: 'Teens (13-17)',
  adults: 'Adults (18-64)',
  seniors: 'Seniors (65+)',
};

// Payment type labels
const paymentLabels: Record<string, string> = {
  medicaid: 'Medicaid',
  medicare: 'Medicare',
  private_insurance: 'Private Insurance',
  sliding_scale: 'Sliding Scale',
  free: 'Free',
  self_pay: 'Self Pay',
};

interface ProviderPageProps {
  params: { id: string };
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const supabase = createClient();

  // Fetch provider (don't filter by is_active to allow providers to preview their own profiles)
  const { data: provider, error } = await supabase
    .from('providers')
    .select(`
      *,
      neighborhoods (
        id,
        name,
        slug
      )
    `)
    .eq('id', params.id)
    .single();

  if (error || !provider) {
    notFound();
  }

  // Show a notice if profile is not active (not approved yet)
  const isNotApproved = !provider.is_active;

  const fullName = `${provider.first_name} ${provider.last_name}`;
  const credentialsStr = provider.credentials?.join(', ') || '';
  const displayName = credentialsStr ? `${fullName}, ${credentialsStr}` : fullName;

  // Format service formats for display
  const hasInPerson = provider.service_formats?.some((f: string) => f === 'in_person' || f === 'hybrid');
  const hasOnline = provider.service_formats?.some((f: string) => f === 'telehealth' || f === 'phone' || f === 'hybrid');

  return (
    <div className="min-h-screen bg-neutral-50">
      <InteractionTracker providerId={provider.id} />
      <CrisisBanner />
      <Navbar />

      <main className="container-app py-8">
        {/* Not Approved Banner */}
        {isNotApproved && (
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900">Profile Pending Approval</h3>
                <p className="mt-1 text-sm text-amber-700">
                  This profile is currently under review and is not visible to the public yet. 
                  You'll be notified once it's approved by our team.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Back link */}
        <Link
          href="/results"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to results
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Header Card */}
            <Card padding="lg">
              <div className="flex flex-col gap-6 sm:flex-row">
                {/* Avatar */}
                <div className="shrink-0">
                  {provider.photo_url ? (
                    <img
                      src={provider.photo_url}
                      alt=""
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <span className="text-3xl font-semibold">
                        {provider.first_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-neutral-900">
                        {displayName}
                      </h1>
                      <p className="mt-1 text-lg text-neutral-600">
                        {providerTypeLabels[provider.provider_type] || 'Provider'}
                      </p>
                    </div>
                    {provider.is_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2.5 py-1 text-xs font-medium text-success-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  {provider.tagline && (
                    <p className="mt-3 text-lg text-neutral-700 italic">
                      &ldquo;{provider.tagline}&rdquo;
                    </p>
                  )}

                  {/* Quick actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ContactButton
                      providerId={provider.id}
                      providerName={`${provider.first_name} ${provider.last_name}`}
                      providerEmail={provider.email}
                      providerFirstName={provider.first_name}
                    />
                    {provider.phone && (
                      <a href={`tel:${provider.phone}`}>
                        <Button variant="outline" leftIcon={<Phone className="h-4 w-4" />}>
                          Call
                        </Button>
                      </a>
                    )}
                    {provider.website && (
                      <a href={provider.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" leftIcon={<Globe className="h-4 w-4" />}>
                          Website
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Info row */}
              <div className="mt-6 flex flex-wrap gap-4 border-t border-neutral-200 pt-6">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  {(provider.neighborhoods as any)?.name || provider.city}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
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
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Clock className="h-4 w-4 text-neutral-400" />
                  {provider.availability_status === 'accepting_new_clients'
                    ? 'Accepting new clients'
                    : provider.availability_status === 'waitlist'
                    ? 'Waitlist available'
                    : 'Limited availability'}
                  {provider.typical_wait_weeks && (
                    <span className="text-neutral-400">
                      • {provider.typical_wait_weeks} week wait
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* About Section */}
            {provider.bio && (
              <Card padding="lg" className="mt-6">
                <h2 className="text-xl font-semibold text-neutral-900">About my practice</h2>
                <div className="mt-4 prose-mhn">
                  <p className="whitespace-pre-wrap">{provider.bio}</p>
                </div>
              </Card>
            )}

            {/* Specialties Section */}
            <Card padding="lg" className="mt-6">
              <h2 className="text-xl font-semibold text-neutral-900">Who I work with</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {provider.age_groups_served?.map((group: string) => (
                  <Tag key={group} variant="accent" size="lg">
                    {ageGroupLabels[group] || group}
                  </Tag>
                ))}
              </div>

              <h3 className="mt-6 text-lg font-medium text-neutral-900">Issues I can help with</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {provider.issues_treated?.map((issue: string) => (
                  <Tag key={issue} variant="default" size="md">
                    {issueLabels[issue] || issue}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Fees Section */}
            <Card padding="lg" className="mt-6">
              <h2 className="text-xl font-semibold text-neutral-900">Fees and payment</h2>
              <div className="mt-4 space-y-3">
                {/* Payment types */}
                <div className="flex flex-wrap gap-2">
                  {provider.payment_types?.map((type: string) => (
                    <Tag key={type} variant="support" size="md">
                      {paymentLabels[type] || type}
                    </Tag>
                  ))}
                </div>

                {/* Insurance */}
                {provider.insurance_accepted?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-neutral-700">Insurance accepted:</h4>
                    <p className="mt-1 text-neutral-600">
                      {provider.insurance_accepted.join(', ')}
                    </p>
                  </div>
                )}

                {/* Sliding scale */}
                {(provider.sliding_scale_min || provider.sliding_scale_max) && (
                  <p className="text-neutral-600">
                    Sliding scale: ${provider.sliding_scale_min || '?'} - ${provider.sliding_scale_max || '?'} per session
                  </p>
                )}

                {/* Self-pay rate */}
                {provider.self_pay_rate && (
                  <p className="text-neutral-600">
                    Self-pay rate: ${provider.self_pay_rate} per session
                  </p>
                )}
              </div>
            </Card>

            {/* Location Section */}
            <Card padding="lg" className="mt-6">
              <h2 className="text-xl font-semibold text-neutral-900">Location</h2>
              <div className="mt-4">
                {provider.address_line1 && (
                  <address className="not-italic text-neutral-700">
                    {provider.address_line1}
                    {provider.address_line2 && <br />}
                    {provider.address_line2}
                    <br />
                    {provider.city}, {provider.state} {provider.zip_code}
                  </address>
                )}

                {/* Map placeholder */}
                <div className="mt-4 h-48 rounded-lg bg-neutral-200 flex items-center justify-center">
                  <span className="text-neutral-500">Map</span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${provider.address_line1 || ''} ${provider.city} ${provider.state} ${provider.zip_code}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Open in Maps <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </Card>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2">
            <ReviewsSection
              providerId={provider.id}
              providerName={`${provider.first_name} ${provider.last_name}`}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
