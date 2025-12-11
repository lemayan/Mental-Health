import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  AlertTriangle,
  Heart,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

const crisisResources = [
  {
    name: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential support for people in distress. Available 24/7.',
    phone: '988',
    text: '988',
    website: 'https://988lifeline.org',
    available: '24/7',
    primary: true,
  },
  {
    name: 'Crisis Text Line',
    description: 'Text-based crisis support for when you need someone to talk to.',
    text: 'HOME to 741741',
    website: 'https://www.crisistextline.org',
    available: '24/7',
    primary: true,
  },
  {
    name: 'Baltimore Crisis Response',
    description: 'Local crisis intervention and mobile crisis team for Baltimore City residents.',
    phone: '410-433-5175',
    available: '24/7',
  },
  {
    name: 'Sheppard Pratt Crisis Walk-In Clinic',
    description: 'Walk-in mental health crisis services. No appointment needed.',
    phone: '410-938-5000',
    address: '6501 N. Charles Street, Baltimore, MD 21204',
    available: '24/7',
  },
  {
    name: 'SAMHSA National Helpline',
    description: 'Treatment referrals and information about mental health and substance use disorders.',
    phone: '1-800-662-4357',
    website: 'https://www.samhsa.gov/find-help/national-helpline',
    available: '24/7, 365 days',
  },
  {
    name: 'Veterans Crisis Line',
    description: 'Crisis support for veterans and their families.',
    phone: '988, then press 1',
    text: '838255',
    website: 'https://www.veteranscrisisline.net',
    available: '24/7',
  },
  {
    name: 'Trevor Project (LGBTQ+ Youth)',
    description: 'Crisis intervention for LGBTQ+ young people ages 13-24.',
    phone: '1-866-488-7386',
    text: 'START to 678-678',
    website: 'https://www.thetrevorproject.org',
    available: '24/7',
  },
];

export default function CrisisPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="bg-crisis-700 py-12 text-white">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <AlertTriangle className="mx-auto h-16 w-16 text-white/90" />
              <h1 className="mt-6 text-3xl font-bold md:text-4xl">
                You don&apos;t have to go through this alone.
              </h1>
              <p className="mt-4 text-lg text-white/90">
                If you&apos;re in crisis or need immediate support, help is available right now.
              </p>

              {/* Emergency notice */}
              <div className="mt-8 rounded-lg bg-white/10 p-4">
                <p className="font-semibold">
                  If you&apos;re in immediate danger, call <strong>911</strong>.
                </p>
              </div>

              {/* Primary actions */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <a href="tel:988">
                  <Button
                    size="lg"
                    className="w-full bg-white text-crisis-700 hover:bg-white/90 sm:w-auto"
                    leftIcon={<Phone className="h-5 w-5" />}
                  >
                    Call 988
                  </Button>
                </a>
                <a href="sms:741741&body=HOME">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white text-white hover:bg-white/10 sm:w-auto"
                    leftIcon={<MessageCircle className="h-5 w-5" />}
                  >
                    Text HOME to 741741
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="section">
          <div className="container-app">
            <h2 className="text-center text-h2 text-neutral-900">
              Crisis Resources
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-neutral-600">
              These services are free, confidential, and available when you need them most.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {crisisResources.map((resource) => (
                <Card
                  key={resource.name}
                  padding="lg"
                  className={resource.primary ? 'border-crisis-200 bg-crisis-50' : ''}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                        resource.primary
                          ? 'bg-crisis-100 text-crisis-700'
                          : 'bg-primary-100 text-primary-600'
                      }`}
                    >
                      <Heart className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {resource.name}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        {resource.description}
                      </p>

                      <div className="mt-4 space-y-2">
                        {resource.phone && (
                          <a
                            href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                            className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                          >
                            <Phone className="h-4 w-4" />
                            {resource.phone}
                          </a>
                        )}
                        {resource.text && (
                          <p className="flex items-center gap-2 text-sm text-neutral-700">
                            <MessageCircle className="h-4 w-4 text-neutral-400" />
                            Text: {resource.text}
                          </p>
                        )}
                        {resource.address && (
                          <p className="flex items-start gap-2 text-sm text-neutral-700">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                            {resource.address}
                          </p>
                        )}
                        {resource.available && (
                          <p className="flex items-center gap-2 text-sm text-neutral-500">
                            <Clock className="h-4 w-4 text-neutral-400" />
                            {resource.available}
                          </p>
                        )}
                        {resource.website && (
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                          >
                            Visit website <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What to expect section */}
        <section className="section bg-white">
          <div className="container-app">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-center text-h2 text-neutral-900">
                What to expect when you call
              </h2>
              <div className="mt-8 space-y-6 text-neutral-700">
                <p>
                  When you call or text a crisis line, you&apos;ll be connected with a trained counselor who will listen without judgment. Here&apos;s what typically happens:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                      1
                    </span>
                    <span>
                      <strong>You&apos;ll be greeted warmly.</strong> The counselor will introduce themselves and ask how they can help.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                      2
                    </span>
                    <span>
                      <strong>Share as much or as little as you want.</strong> You don&apos;t have to have all the answers or know exactly what&apos;s wrong.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                      3
                    </span>
                    <span>
                      <strong>They&apos;ll help you through this moment.</strong> Together, you&apos;ll work on a plan to get through the immediate crisis.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                      4
                    </span>
                    <span>
                      <strong>You may be connected to local resources.</strong> If helpful, they can provide referrals for ongoing support.
                    </span>
                  </li>
                </ul>
                <p className="text-sm text-neutral-500">
                  All calls are confidential. If you&apos;re worried about what happens when you call, you can ask the counselor about confidentiality at the start of your conversation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Not in crisis section */}
        <section className="section bg-neutral-50">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-h2 text-neutral-900">
                Looking for ongoing support?
              </h2>
              <p className="mt-4 text-neutral-600">
                If you&apos;re not in immediate crisis but want to find a therapist or other mental health support, we can help you explore your options.
              </p>
              <div className="mt-8">
                <Link href="/navigator">
                  <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Find mental health support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
