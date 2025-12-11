import { Metadata } from 'next';
import { CrisisBanner } from '@/components/layout';
import { Navbar } from '@/components/layout';
import { Card } from '@/components/ui';
import { Heart, Users, AlertCircle, CheckCircle, MessageCircle, TrendingUp, Home } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mental Health for Families & Youth | Baltimore Mental Health Navigator',
  description: 'Essential information about youth mental health, warning signs, and how families can support young people\'s emotional well-being.',
};

export default function FamiliesYouthPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-h1 text-neutral-900">Mental Health for Families & Youth</h1>
              <p className="mt-4 text-body-lg text-neutral-600">
                Supporting young people's emotional well-being through awareness, connection, and care
              </p>
            </div>
          </div>
        </section>

        {/* Key Statistics */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-8">Why Youth Mental Health Matters</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card padding="lg" className="border-l-4 border-l-error-500">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error-100 flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-error-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-neutral-900">40%+</div>
                    <p className="mt-1 text-sm text-neutral-600">Of high school students reported persistent feelings of sadness or hopelessness</p>
                  </div>
                </div>
              </Card>

              <Card padding="lg" className="border-l-4 border-l-accent-500">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100 flex-shrink-0">
                    <Heart className="h-6 w-6 text-accent-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-neutral-900">Early</div>
                    <p className="mt-1 text-sm text-neutral-600">Treatment is most effective when started early—symptoms in childhood often persist into adulthood</p>
                  </div>
                </div>
              </Card>

              <Card padding="lg" className="border-l-4 border-l-primary-500">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 flex-shrink-0">
                    <Home className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-neutral-900">Critical</div>
                    <p className="mt-1 text-sm text-neutral-600">Family support and communication are essential to youth mental wellness</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="section">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Mental Health Is a Lifeline</h2>
            <Card padding="lg" className="mb-6">
              <p className="text-neutral-700 mb-4">
                Mental health isn't just a buzzword—it's a lifeline. For young people navigating school, relationships, identity, and social pressures, emotional well-being can make all the difference in their ability to lead, learn, and thrive.
              </p>
              <p className="text-neutral-700">
                In the United States, teens are experiencing rising levels of anxiety, depression, and stress. The good news? Awareness is growing, and with the right support systems in place, families can help turn the tide.
              </p>
            </Card>
          </div>
        </section>

        {/* Warning Signs */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Warning Signs in Children & Teens</h2>
            <p className="text-neutral-700 mb-8">
              It can be tough to tell if troubling behavior is just part of growing up or a problem that needs professional attention. If behavioral signs last weeks or months and interfere with daily life at home, school, or with friends, it's time to reach out for help.
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-accent-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Younger Children (Under 12)</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span>Frequent tantrums or intense irritability much of the time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span>Often seem fearful or worried</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span>Frequent stomachaches or headaches with no known medical cause</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span>In constant motion and cannot sit quietly (except during screen time)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span>Sleep problems, nightmares, or excessive sleepiness during the day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span>Not interested in playing with other children or difficulty making friends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span>Struggling academically or recent decline in grades</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span>Repeatedly checking things out of fear something bad may happen</span>
                  </li>
                </ul>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-error-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Older Children & Teens</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Lost interest in things they used to enjoy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Low energy or persistent fatigue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Major changes in sleep patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Periods of highly elevated energy requiring much less sleep than usual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Spending more time alone and avoiding social activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Excessive dieting, exercising, or fear of gaining weight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Self-harm behaviors (cutting or burning skin)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Smoking, drinking alcohol, or using drugs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Risky or destructive behavior</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Thoughts of suicide or self-harm</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* How Families Can Help */}
        <section className="section">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">How Families Can Support Youth Mental Health</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="h-6 w-6 text-primary-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Build Open Communication</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Create safe spaces:</strong> Let your child know they can talk without fear of judgment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Listen actively:</strong> Being heard matters more than having all the answers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Validate feelings:</strong> Acknowledge their emotions even if you don't understand them</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Model healthy behavior:</strong> Show how you manage stress and emotions</span>
                  </li>
                </ul>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-accent-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Foster Connection & Purpose</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Encourage mentorship:</strong> Trusted role models outside the family can provide additional support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Support their interests:</strong> Activities they enjoy build confidence and reduce stress</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Maintain routines:</strong> Consistent schedules provide security and stability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Celebrate strengths:</strong> Focus on what they're doing well, not just problems</span>
                  </li>
                </ul>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-6 w-6 text-primary-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Seek Professional Support</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Don't wait:</strong> Early treatment is more effective and can prevent problems from worsening</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Start with your pediatrician:</strong> They can provide referrals to mental health specialists</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Consider school counselors:</strong> They can provide support and connect you with resources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Use our navigator:</strong> Find providers who specialize in children and adolescents</span>
                  </li>
                </ul>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <Home className="h-6 w-6 text-accent-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Reduce Stigma at Home</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Normalize mental health:</strong> Talk about it like you would physical health</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Educate yourself:</strong> Learn about mental health conditions and treatments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Share your story:</strong> If you've struggled with mental health, let them know they're not alone</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Advocate at school:</strong> Work with educators to create supportive environments</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Emergency Resources */}
        <section className="section bg-crisis-50 border-t-4 border-t-crisis-600">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">If Your Child Is in Crisis</h2>
            <Card padding="lg" className="border-l-4 border-l-crisis-600">
              <div className="space-y-4">
                <p className="text-neutral-700">
                  <strong>If you or your child are experiencing a mental health emergency, immediate help is available:</strong>
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl font-bold text-crisis-600 flex-shrink-0">988</span>
                    <div>
                      <p className="font-semibold text-neutral-900">Suicide & Crisis Lifeline</p>
                      <p className="text-sm text-neutral-600">Call or text 988 for free, confidential support 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl font-bold text-crisis-600 flex-shrink-0">911</span>
                    <div>
                      <p className="font-semibold text-neutral-900">Emergency Services</p>
                      <p className="text-sm text-neutral-600">Call 911 if there is immediate danger of harm</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mt-4">
                  It may be helpful for children and teens to save emergency numbers to their cell phones—the ability to get immediate help for themselves or a friend can make a difference.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Additional Resources</h2>
            <div className="space-y-4">
              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <Link href="/navigator" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">Find Child & Teen Mental Health Providers</h3>
                  <p className="text-sm text-neutral-600">Use our navigator to find providers who specialize in children and adolescents</p>
                </Link>
              </Card>

              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <a href="https://www.nimh.nih.gov/health/publications/children-and-mental-health" target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">NIMH: Children and Mental Health</h3>
                  <p className="text-sm text-neutral-600">Comprehensive information about children's mental health from the National Institute of Mental Health</p>
                </a>
              </Card>

              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <a href="https://www.samhsa.gov/families" target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">SAMHSA Family Resources</h3>
                  <p className="text-sm text-neutral-600">Resources for families from the Substance Abuse and Mental Health Services Administration</p>
                </a>
              </Card>

              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <a href="https://www.cdc.gov/childrensmentalhealth/" target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">CDC Children's Mental Health</h3>
                  <p className="text-sm text-neutral-600">Information about symptoms, treatment, data, and child development from the CDC</p>
                </a>
              </Card>

              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <Link href="/crisis" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">Crisis Resources</h3>
                  <p className="text-sm text-neutral-600">Immediate help and emergency mental health resources</p>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Data Source */}
        <section className="section bg-neutral-100">
          <div className="container-app">
            <Card padding="md" className="text-center">
              <p className="text-sm text-neutral-600">
                <strong>Sources:</strong> Information on this page is from the National Institute of Mental Health (NIMH), 
                Centers for Disease Control and Prevention (CDC), and Capital Youth Empowerment Program (CYEP).
              </p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
