import { Metadata } from 'next';
import { CrisisBanner } from '@/components/layout';
import { Navbar } from '@/components/layout';
import { Card } from '@/components/ui';
import { DollarSign, TrendingUp, Users, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Understanding Mental Health Care Costs & Insurance | Baltimore Mental Health Navigator',
  description: 'Learn about mental health care costs, insurance coverage, and financial barriers to accessing psychotherapy services in the United States.',
};

export default function CostInsurancePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-h1 text-neutral-900">Understanding Mental Health Care Costs & Insurance</h1>
              <p className="mt-4 text-body-lg text-neutral-600">
                Important information about insurance coverage, costs, and accessing affordable mental health care
              </p>
            </div>
          </div>
        </section>

        {/* Key Statistics */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-8">Key Facts About Mental Health Care Costs</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card padding="lg" className="border-l-4 border-l-primary-500">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-neutral-900">$143</div>
                    <p className="mt-1 text-sm text-neutral-600">Average cost per therapy session (private pay)</p>
                  </div>
                </div>
              </Card>

              <Card padding="lg" className="border-l-4 border-l-accent-500">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100 flex-shrink-0">
                    <Users className="h-6 w-6 text-accent-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-neutral-900">35%</div>
                    <p className="mt-1 text-sm text-neutral-600">Of private practice therapists don't accept any insurance</p>
                  </div>
                </div>
              </Card>

              <Card padding="lg" className="border-l-4 border-l-error-500">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error-100 flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-error-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-neutral-900">40%</div>
                    <p className="mt-1 text-sm text-neutral-600">Lower Medicaid rates compared to private pay rates</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Understanding Insurance Coverage */}
        <section className="section">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Understanding Insurance Coverage</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">What's Covered</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span><strong>Mental Health Parity:</strong> Federal law requires most insurance plans to cover mental health services similarly to physical health services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span><strong>Psychotherapy:</strong> Individual, group, and family therapy sessions are typically covered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span><strong>Diagnostic Services:</strong> Mental health assessments and evaluations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span><strong>Medication Management:</strong> Visits with prescribing providers for psychiatric medications</span>
                  </li>
                </ul>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-error-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Common Barriers</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span><strong>Provider Availability:</strong> Many therapists don't accept insurance, requiring out-of-pocket payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span><strong>Out-of-Network Costs:</strong> Higher copays and deductibles when seeing providers outside your network</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span><strong>Wait Times:</strong> Limited in-network providers can mean long waits for appointments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span><strong>Reimbursement Gaps:</strong> Insurance reimbursement rates are often significantly lower than private pay rates</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Cost Breakdown */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Typical Cost Breakdown</h2>
            <div className="space-y-4">
              <Card padding="lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-neutral-900">Private Pay (Cash) Therapy</h3>
                  <span className="text-2xl font-bold text-primary-600">$143</span>
                </div>
                <p className="text-sm text-neutral-600">Average per-session cost without insurance. Rates vary by provider type and location.</p>
              </Card>

              <Card padding="lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-neutral-900">With Insurance (In-Network)</h3>
                  <span className="text-2xl font-bold text-primary-600">$15-$50</span>
                </div>
                <p className="text-sm text-neutral-600">Typical copay per session. Actual amount depends on your specific plan.</p>
              </Card>

              <Card padding="lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-neutral-900">Medicaid Coverage</h3>
                  <span className="text-2xl font-bold text-primary-600">$83</span>
                </div>
                <p className="text-sm text-neutral-600">Average reimbursement rate for a 45-minute therapy session. Often no cost to patients.</p>
              </Card>

              <Card padding="lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-neutral-900">Out-of-Network</h3>
                  <span className="text-2xl font-bold text-error-600">$100-$200+</span>
                </div>
                <p className="text-sm text-neutral-600">You may need to pay upfront and seek reimbursement. Higher deductibles and coinsurance apply.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Tips for Affording Care */}
        <section className="section">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Tips for Affording Mental Health Care</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card padding="lg">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Before Your First Appointment</h3>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Check your insurance benefits:</strong> Call your insurance company to understand your mental health coverage, copays, and deductibles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Verify provider network status:</strong> Confirm if the therapist is in-network before scheduling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Ask about sliding scale fees:</strong> Many therapists offer reduced rates based on income</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Explore community mental health centers:</strong> These often accept Medicaid and offer affordable options</span>
                  </li>
                </ul>
              </Card>

              <Card padding="lg">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Alternative Options</h3>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Medicaid coverage:</strong> If you qualify, mental health services are typically covered with little to no copay</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Employee Assistance Programs (EAPs):</strong> Many employers offer free short-term counseling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Training clinics:</strong> Universities with counseling programs offer reduced-cost services with supervised graduate students</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Online therapy platforms:</strong> Often more affordable than traditional in-person therapy</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="section bg-primary-50">
          <div className="container-app">
            <Card padding="lg" className="border-l-4 border-l-primary-600">
              <div className="flex items-start gap-4">
                <Info className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Why Insurance Matters</h3>
                  <p className="text-neutral-700 mb-3">
                    Research shows that cost and insurance coverage are among the most significant barriers to accessing mental health care. 
                    About one-third of private practice psychotherapists don't accept any insurance, which means many people must pay out-of-pocket 
                    even when they have coverage.
                  </p>
                  <p className="text-neutral-700">
                    The gap between insurance reimbursement rates and private pay rates is significant—Medicaid rates average 40% lower than 
                    what providers charge cash-paying clients. This creates financial disincentives for providers to accept insurance, 
                    particularly public insurance programs, despite the critical need for accessible mental health services.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Resources */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Additional Resources</h2>
            <div className="space-y-4">
              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <a href="https://www.healthcare.gov/coverage/mental-health-substance-abuse-coverage/" target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">Healthcare.gov Mental Health Coverage</h3>
                  <p className="text-sm text-neutral-600">Learn about your rights to mental health coverage under the Affordable Care Act</p>
                </a>
              </Card>

              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <a href="https://www.nami.org/Advocacy/Policy-Priorities/Improving-Health/Health-Care-Reform" target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">NAMI: Understanding Mental Health Insurance</h3>
                  <p className="text-sm text-neutral-600">Advocacy and information about improving mental health insurance coverage</p>
                </a>
              </Card>

              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <a href="/navigator" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">Find Providers Who Accept Your Insurance</h3>
                  <p className="text-sm text-neutral-600">Use our navigator tool to filter providers by insurance type</p>
                </a>
              </Card>
            </div>
          </div>
        </section>

        {/* Data Source */}
        <section className="section bg-neutral-100">
          <div className="container-app">
            <Card padding="md" className="text-center">
              <p className="text-sm text-neutral-600">
                <strong>Data Source:</strong> Statistics on this page are from the peer-reviewed study 
                "Insurance acceptance and cash pay rates for psychotherapy in the US" published in 
                <em> Health Affairs Scholar</em> (2024), analyzing 175,083 psychotherapy providers nationwide.
                <br />
                <a 
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11412241/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline ml-1"
                >
                  Read the full research study
                </a>
              </p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
