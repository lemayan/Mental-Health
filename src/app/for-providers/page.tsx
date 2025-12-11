import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CrisisBanner } from '@/components/layout/crisis-banner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Target,
  PenLine,
  BarChart3,
  Search,
  CheckCircle2,
  ArrowRight,
  Users,
  Heart,
  Shield,
} from 'lucide-react';

export default function ForProvidersPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-display text-balance text-neutral-900">
                Reach Baltimore residents who are actively looking for mental health support
              </h1>
              <p className="mt-6 text-body-lg text-neutral-600">
                Baltimore Mental Health Navigator helps you connect with people in your community who match your expertise and insurance panels.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/for-providers/claim">
                  <Button size="lg">Claim my profile</Button>
                </Link>
                <Link href="/for-providers/create">
                  <Button variant="secondary" size="lg">
                    Create a new profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-center text-h2 text-neutral-900">Why list with us</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card padding="lg" className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100">
                  <Target className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-h4 text-neutral-900">Targeted visibility</h3>
                <p className="mt-2 text-body text-neutral-600">
                  Show up in search results for residents who match your specialties, insurance panels, and availability.
                </p>
              </Card>

              <Card padding="lg" className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-100">
                  <PenLine className="h-7 w-7 text-accent-600" />
                </div>
                <h3 className="text-h4 text-neutral-900">Share your story</h3>
                <p className="mt-2 text-body text-neutral-600">
                  Write about your approach and contribute to our local resource hub to help residents make informed choices.
                </p>
              </Card>

              <Card padding="lg" className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-support-100">
                  <BarChart3 className="h-7 w-7 text-support-600" />
                </div>
                <h3 className="text-h4 text-neutral-900">Track inquiries</h3>
                <p className="mt-2 text-body text-neutral-600">
                  See who&apos;s reaching out through the platform and respond easily from your dashboard.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section bg-neutral-50">
          <div className="container-app">
            <h2 className="text-center text-h2 text-neutral-900">How it works</h2>
            <div className="mx-auto mt-12 max-w-2xl">
              <div className="space-y-8">
                {[
                  {
                    step: 1,
                    title: 'Search for your existing listing',
                    description: 'We may already have a profile for you based on public information. Search to find and claim it.',
                    icon: Search,
                  },
                  {
                    step: 2,
                    title: 'Claim and verify your profile',
                    description: 'Verify your identity with a simple email check. We review claims within 2 business days.',
                    icon: Shield,
                  },
                  {
                    step: 3,
                    title: 'Customize your profile',
                    description: 'Add your bio, specialties, fees, and photo to help residents get to know you.',
                    icon: PenLine,
                  },
                  {
                    step: 4,
                    title: 'Start receiving inquiries',
                    description: 'Residents who match your profile can reach out directly through our secure contact form.',
                    icon: Users,
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-white">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-neutral-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section bg-primary-600">
          <div className="container-app">
            <div className="grid gap-8 text-center md:grid-cols-3">
              <div>
                <p className="text-4xl font-bold text-white">5,000+</p>
                <p className="mt-2 text-primary-100">Monthly searches</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">200+</p>
                <p className="mt-2 text-primary-100">Providers listed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">40+</p>
                <p className="mt-2 text-primary-100">Baltimore neighborhoods</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-center text-h2 text-neutral-900">What&apos;s included</h2>
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  'Detailed provider profile',
                  'Specialty and issue tags',
                  'Insurance panel listings',
                  'Availability status',
                  'Contact form integration',
                  'Inquiry notifications',
                  'Profile analytics',
                  'Mobile-optimized display',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-neutral-700">
                    <CheckCircle2 className="h-5 w-5 text-success-500" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-lg bg-neutral-100 p-4 text-center">
                <p className="text-sm text-neutral-600">
                  <Heart className="mr-1 inline h-4 w-4 text-crisis-600" />
                  Listings are currently <strong>free</strong> for all Baltimore-area providers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-neutral-50">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-h2 text-neutral-900">Ready to get started?</h2>
              <p className="mt-4 text-body-lg text-neutral-600">
                Join our growing directory of Baltimore mental health providers.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/for-providers/claim">
                  <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Claim my profile
                  </Button>
                </Link>
                <Link href="/for-providers/create">
                  <Button variant="outline" size="lg">
                    Create a new profile
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-neutral-500">
                Questions? Email us at{' '}
                <a
                  href="mailto:providers@baltimoremhn.org"
                  className="text-primary-600 hover:underline"
                >
                  providers@baltimoremhn.org
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
