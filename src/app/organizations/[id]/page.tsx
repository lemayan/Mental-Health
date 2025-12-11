import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CrisisBanner } from '@/components/layout/crisis-banner';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { Card } from '@/components/ui/card';
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
  DoorOpen,
  CircleDollarSign,
  FileText,
} from 'lucide-react';

// Map organization type to display label
const organizationTypeLabels: Record<string, string> = {
  community_mental_health_center: 'Community Mental Health Center',
  hospital_clinic: 'Hospital Clinic',
  nonprofit: 'Nonprofit Organization',
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

interface OrganizationPageProps {
  params: { id: string };
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const supabase = createClient();

  // Fetch organization
  const { data: organization, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', params.id)
    .eq('is_active', true)
    .single();

  if (error || !organization) {
    notFound();
  }

  // Fetch locations
  const { data: locations } = await supabase
    .from('organization_locations')
    .select(`
      *,
      neighborhoods (
        id,
        name,
        slug
      )
    `)
    .eq('organization_id', params.id)
    .order('is_primary', { ascending: false });

  // Format service formats for display
  const hasInPerson = organization.service_formats?.some((f: string) => f === 'in_person' || f === 'hybrid');
  const hasOnline = organization.service_formats?.some((f: string) => f === 'telehealth' || f === 'phone' || f === 'hybrid');

  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main className="container-app py-8">
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
                {/* Logo */}
                <div className="shrink-0">
                  {organization.logo_url ? (
                    <img
                      src={organization.logo_url}
                      alt=""
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-support-100 text-support-600">
                      <Building2 className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-neutral-900">
                        {organization.name}
                      </h1>
                      <p className="mt-1 text-lg text-neutral-600">
                        {organizationTypeLabels[organization.organization_type] || 'Organization'}
                      </p>
                    </div>
                    {organization.is_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2.5 py-1 text-xs font-medium text-success-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  {organization.tagline && (
                    <p className="mt-3 text-lg text-neutral-700 italic">
                      &ldquo;{organization.tagline}&rdquo;
                    </p>
                  )}

                  {/* Special badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {organization.is_free && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-100 px-3 py-1.5 text-sm font-medium text-success-700">
                        <CircleDollarSign className="h-4 w-4" />
                        Free services
                      </span>
                    )}
                    {organization.accepts_walk_ins && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700">
                        <DoorOpen className="h-4 w-4" />
                        Walk-ins welcome
                      </span>
                    )}
                    {organization.referral_required && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-100 px-3 py-1.5 text-sm font-medium text-warning-700">
                        <FileText className="h-4 w-4" />
                        Referral required
                      </span>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button leftIcon={<Mail className="h-4 w-4" />}>
                      Contact us
                    </Button>
                    {organization.phone && (
                      <a href={`tel:${organization.phone}`}>
                        <Button variant="outline" leftIcon={<Phone className="h-4 w-4" />}>
                          Call
                        </Button>
                      </a>
                    )}
                    {organization.website && (
                      <a href={organization.website} target="_blank" rel="noopener noreferrer">
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
              </div>
            </Card>

            {/* About Section */}
            {organization.description && (
              <Card padding="lg" className="mt-6">
                <h2 className="text-xl font-semibold text-neutral-900">What we offer</h2>
                <div className="mt-4 prose-mhn">
                  <p className="whitespace-pre-wrap">{organization.description}</p>
                </div>
              </Card>
            )}

            {/* Services Section */}
            {organization.services_offered?.length > 0 && (
              <Card padding="lg" className="mt-6">
                <h2 className="text-xl font-semibold text-neutral-900">Services and programs</h2>
                <ul className="mt-4 space-y-2">
                  {organization.services_offered.map((service: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-neutral-700">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-500" />
                      {service}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Who we serve Section */}
            <Card padding="lg" className="mt-6">
              <h2 className="text-xl font-semibold text-neutral-900">Who we serve</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {organization.age_groups_served?.map((group: string) => (
                  <Tag key={group} variant="accent" size="lg">
                    {ageGroupLabels[group] || group}
                  </Tag>
                ))}
              </div>

              <h3 className="mt-6 text-lg font-medium text-neutral-900">Issues we address</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {organization.issues_addressed?.map((issue: string) => (
                  <Tag key={issue} variant="support" size="md">
                    {issueLabels[issue] || issue}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* How to get started */}
            {organization.how_to_access && (
              <Card padding="lg" className="mt-6">
                <h2 className="text-xl font-semibold text-neutral-900">How to get started</h2>
                <div className="mt-4 prose-mhn">
                  <p className="whitespace-pre-wrap">{organization.how_to_access}</p>
                </div>
              </Card>
            )}

            {/* Fees Section */}
            <Card padding="lg" className="mt-6">
              <h2 className="text-xl font-semibold text-neutral-900">Costs and insurance</h2>
              <div className="mt-4 space-y-3">
                {organization.is_free ? (
                  <p className="flex items-center gap-2 text-lg font-medium text-success-700">
                    <CircleDollarSign className="h-5 w-5" />
                    Services are free
                  </p>
                ) : (
                  <>
                    {/* Payment types */}
                    <div className="flex flex-wrap gap-2">
                      {organization.payment_types?.map((type: string) => (
                        <Tag key={type} variant="neutral" size="md">
                          {paymentLabels[type] || type}
                        </Tag>
                      ))}
                    </div>

                    {/* Insurance */}
                    {organization.insurance_accepted?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-neutral-700">Insurance accepted:</h4>
                        <p className="mt-1 text-neutral-600">
                          {organization.insurance_accepted.join(', ')}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* Locations Section */}
            {locations && locations.length > 0 && (
              <Card padding="lg" className="mt-6">
                <h2 className="text-xl font-semibold text-neutral-900">
                  {locations.length > 1 ? 'Locations' : 'Location'}
                </h2>
                <div className="mt-4 space-y-6">
                  {locations.map((location: any) => (
                    <div key={location.id} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                      {location.name && (
                        <h3 className="font-medium text-neutral-900">
                          {location.name}
                          {location.is_primary && (
                            <span className="ml-2 text-xs text-neutral-500">(Primary)</span>
                          )}
                        </h3>
                      )}
                      <address className="mt-2 not-italic text-neutral-700">
                        {location.address_line1}
                        {location.address_line2 && <br />}
                        {location.address_line2}
                        <br />
                        {location.city}, {location.state} {location.zip_code}
                      </address>
                      {location.phone && (
                        <a
                          href={`tel:${location.phone}`}
                          className="mt-2 inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                        >
                          <Phone className="h-4 w-4" />
                          {location.phone}
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${location.address_line1} ${location.city} ${location.state} ${location.zip_code}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Open in Maps <ExternalLink className="inline h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Contact Form */}
          <div className="lg:col-span-1">
            <Card padding="lg" className="sticky top-24">
              <h2 className="text-xl font-semibold text-neutral-900">Contact us</h2>
              <form className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Your name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="block h-11 w-full rounded-lg border border-neutral-200 px-3 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="block h-11 w-full rounded-lg border border-neutral-200 px-3 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="block h-11 w-full rounded-lg border border-neutral-200 px-3 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Tell us what you're looking for..."
                    className="block w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <Button type="submit" fullWidth>
                  Send message
                </Button>

                <p className="flex items-start gap-2 text-xs text-neutral-500">
                  <Shield className="h-4 w-4 shrink-0 text-neutral-400" />
                  Your information is only shared with this organization.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
