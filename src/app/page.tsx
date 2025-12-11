import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tag } from '@/components/ui/tag';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CrisisBanner } from '@/components/layout/crisis-banner';
import {
  Heart,
  Brain,
  Users,
  Building2,
  Phone,
  ArrowRight,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <CrisisBanner />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-display text-balance text-neutral-900">
              Find the right mental health support in Baltimore
            </h1>
            <p className="mt-6 text-body-lg text-neutral-600">
              Answer a few questions and we&apos;ll match you with therapists,
              community programs, and resources that fit your needs, insurance,
              and neighborhood.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/navigator">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Get started
                </Button>
              </Link>
              <Link href="/results">
                <Button variant="ghost" size="lg">
                  Browse all resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-white">
        <div className="container-app">
          <h2 className="text-center text-h2 text-neutral-900">How it works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Answer a few simple questions',
                description:
                  'Tell us what you\'re looking for, who needs help, and how you\'d like to pay.',
                icon: CheckCircle2,
              },
              {
                step: '2',
                title: 'See your personalized matches',
                description:
                  'We\'ll show you providers and programs that fit, ranked by how well they match.',
                icon: Users,
              },
              {
                step: '3',
                title: 'Reach out directly',
                description:
                  'Contact providers through our site or find their information to call or visit.',
                icon: Phone,
              },
            ].map((item) => (
              <Card key={item.step} variant="outlined" padding="lg" className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <item.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-h4 text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-body-sm text-neutral-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="section bg-neutral-50">
        <div className="container-app">
          <h2 className="text-center text-h2 text-neutral-900">
            What kind of support are you looking for?
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                title: 'Therapy & Counseling',
                description: 'Talk with a licensed therapist',
                icon: Brain,
                color: 'primary',
                href: '/results?issue=therapy',
              },
              {
                title: 'Medication & Psychiatry',
                description: 'Get evaluated for medication',
                icon: Heart,
                color: 'support',
                href: '/results?providerType=psychiatrist',
              },
              {
                title: 'Youth & Family Support',
                description: 'Help for children, teens, and families',
                icon: Users,
                color: 'accent',
                href: '/results?ageGroup=children',
              },
              {
                title: 'Community Programs',
                description: 'Groups, peer support, and local orgs',
                icon: Building2,
                color: 'primary',
                href: '/results?serviceFormat=group',
              },
              {
                title: 'Crisis & Urgent Help',
                description: 'Immediate support when you need it',
                icon: Phone,
                color: 'support',
                href: '/crisis',
              },
            ].map((category) => (
              <Link
                key={category.title}
                href={category.href as any}
                className="block"
              >
                <Card
                  variant="interactive"
                  padding="md"
                  className="text-center h-full hover:shadow-lg transition-shadow"
                >
                  <div
                    className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-${category.color}-100`}
                  >
                    <category.icon className={`h-5 w-5 text-${category.color}-600`} />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">{category.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="section-sm bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container-app">
          <div className="text-center mb-8">
            <h2 className="text-h2 text-neutral-900">
              Find help in your neighborhood
            </h2>
            <p className="mt-2 text-body text-neutral-600 max-w-2xl mx-auto">
              Browse mental health providers by popular Baltimore neighborhoods and surrounding areas
            </p>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 max-w-6xl mx-auto">
            {[
              { name: 'Downtown / Inner Harbor', zip: '21201', count: '23' },
              { name: 'Canton / Highlandtown', zip: '21224', count: '18' },
              { name: 'Fells Point', zip: '21231', count: '15' },
              { name: 'Federal Hill', zip: '21230', count: '12' },
              { name: 'Hampden / Roland Park', zip: '21210', count: '20' },
              { name: 'Towson', zip: '21286', count: '25' },
              { name: 'Pikesville', zip: '21208', count: '16' },
              { name: 'Catonsville', zip: '21228', count: '14' },
              { name: 'Dundalk', zip: '21222', count: '10' },
              { name: 'Parkville', zip: '21234', count: '11' },
              { name: 'Ellicott City', zip: '21043', count: '19' },
              { name: 'Columbia', zip: '21044', count: '22' },
              { name: 'Glen Burnie', zip: '21060', count: '13' },
              { name: 'Annapolis', zip: '21401', count: '17' },
              { name: 'Brooklyn / Curtis Bay', zip: '21225', count: '8' },
            ].map((neighborhood) => (
              <Link
                key={neighborhood.name}
                href={`/results?zipCode=${neighborhood.zip}`}
                className="group relative overflow-hidden rounded-xl border-2 border-neutral-200 bg-white p-4 transition-all hover:border-primary-500 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors leading-tight">
                        {neighborhood.name}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-500">ZIP: {neighborhood.zip}</p>
                  </div>
                  <div className="flex-shrink-0 rounded-full bg-primary-100 px-2 py-1">
                    <span className="text-xs font-bold text-primary-700">{neighborhood.count}+</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary-500 to-purple-500 transition-all group-hover:w-full"></div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link
              href="/results"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-900 transition-colors"
            >
              View all providers across Baltimore
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
