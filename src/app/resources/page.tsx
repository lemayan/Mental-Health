import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CrisisBanner } from '@/components/layout/crisis-banner';
import { Card } from '@/components/ui/card';
import { Tag } from '@/components/ui/tag';
import {
  BookOpen,
  DollarSign,
  Users,
  Heart,
  Brain,
  Pill,
  Baby,
  ArrowRight,
  Clock,
} from 'lucide-react';

const featuredGuides = [
  {
    slug: '/about',
    title: 'Your First Time in Therapy: What to Expect',
    excerpt: 'Feeling nervous about starting therapy? Here\'s everything you need to know about your first appointment.',
    category: 'Getting Started',
    readTime: '5 min read',
    icon: Heart,
    external: false,
  },
  {
    slug: 'https://www.nami.org/Your-Journey/Individuals-with-Mental-Illness/Finding-a-Mental-Health-Professional',
    title: 'Finding Affordable Mental Health Care',
    excerpt: 'A guide to sliding scale fees, community mental health centers, and free resources.',
    category: 'Cost & Insurance',
    readTime: '8 min read',
    icon: DollarSign,
    external: true,
  },
  {
    slug: 'https://www.nimh.nih.gov/health/publications/children-and-mental-health',
    title: 'Supporting Your Teen\'s Mental Health',
    excerpt: 'Signs to watch for, how to start the conversation, and when to seek professional help.',
    category: 'Families & Youth',
    readTime: '7 min read',
    icon: Users,
    external: true,
  },
  {
    slug: 'https://www.apa.org/topics/psychotherapy/understanding',
    title: 'Types of Therapy: Finding the Right Fit',
    excerpt: 'CBT, DBT, EMDR — what do they all mean? A plain-language guide to different therapy approaches.',
    category: 'Getting Started',
    readTime: '10 min read',
    icon: Brain,
    external: true,
  },
  {
    slug: 'https://www.nimh.nih.gov/health/topics/mental-health-medications',
    title: 'Questions to Ask About Psychiatric Medication',
    excerpt: 'Considering medication? Here are the questions to discuss with your provider.',
    category: 'Medication',
    readTime: '6 min read',
    icon: Pill,
    external: true,
  },
  {
    slug: 'https://childmind.org/guide/when-to-seek-treatment-for-your-child/',
    title: 'When Should My Child See a Therapist?',
    excerpt: 'Understanding when professional support might help your child thrive.',
    category: 'Families & Youth',
    readTime: '6 min read',
    icon: Baby,
    external: true,
  },
];

const categories = [
  { name: 'Getting Started', count: 8, slug: '/about' },
  { name: 'Cost & Insurance', count: 5, slug: '/resources/cost-insurance' },
  { name: 'Families & Youth', count: 6, slug: '/resources/families-youth' },
  { name: 'Medication', count: 4, slug: '/resources/medication' },
  { name: 'Crisis Support', count: 3, slug: '/crisis' },
  { name: 'Self-Care', count: 7, slug: '/resources/self-care' },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-h1 text-neutral-900">Resource Hub</h1>
              <p className="mt-4 text-body-lg text-neutral-600">
                Guides, articles, and information to help you navigate mental health care in Baltimore.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-neutral-200 bg-white py-6">
          <div className="container-app">
            <div className="flex flex-wrap justify-center gap-2">
              <Tag variant="default" size="lg" interactive>
                All
              </Tag>
              {categories.map((category) => {
                const isExternal = category.slug.startsWith('http');
                return isExternal ? (
                  <a 
                    key={category.slug} 
                    href={category.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Tag variant="outline" size="lg" interactive>
                      {category.name} ({category.count})
                    </Tag>
                  </a>
                ) : (
                  <Link key={category.slug} href={category.slug as any}>
                    <Tag variant="outline" size="lg" interactive>
                      {category.name} ({category.count})
                    </Tag>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Guides */}
        <section className="section">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900">Popular Guides</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={guide.slug as any}
                  target={guide.external ? "_blank" : undefined}
                  rel={guide.external ? "noopener noreferrer" : undefined}
                >
                  <Card variant="interactive" padding="lg" className="h-full">
                    <div className="flex h-full flex-col">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                        <guide.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <Tag variant="neutral" size="sm" className="mb-3 w-fit">
                        {guide.category}
                      </Tag>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {guide.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-neutral-600">
                        {guide.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-neutral-500">
                          <Clock className="h-3.5 w-3.5" />
                          {guide.readTime}
                        </span>
                        <span className="text-sm font-medium text-primary-600">
                          Read more <ArrowRight className="inline h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900">Quick Links</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/crisis">
                <Card variant="outlined" padding="md" className="hover:border-crisis-300 hover:bg-crisis-50 transition-colors">
                  <h3 className="font-semibold text-neutral-900">Crisis Resources</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Immediate help when you need it most
                  </p>
                </Card>
              </Link>
              <Link href="/resources/cost-insurance">
                <Card variant="outlined" padding="md" className="hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <h3 className="font-semibold text-neutral-900">Insurance Guide</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Understanding costs and coverage
                  </p>
                </Card>
              </Link>
              <Link href="/results">
                <Card variant="outlined" padding="md" className="hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <h3 className="font-semibold text-neutral-900">Browse All Providers</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    View all mental health providers
                  </p>
                </Card>
              </Link>
              <Link href="/for-providers">
                <Card variant="outlined" padding="md" className="hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <h3 className="font-semibold text-neutral-900">For Mental Health Providers</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    List your practice or service
                  </p>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-primary-50">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <BookOpen className="mx-auto h-12 w-12 text-primary-500" />
              <h2 className="mt-4 text-h2 text-neutral-900">
                Ready to find support?
              </h2>
              <p className="mt-2 text-neutral-600">
                Use our guided navigator to find providers and programs that match your needs.
              </p>
              <Link
                href="/navigator"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                Get started <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
