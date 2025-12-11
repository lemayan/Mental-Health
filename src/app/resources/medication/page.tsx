import { Metadata } from 'next';
import { CrisisBanner } from '@/components/layout';
import { Navbar } from '@/components/layout';
import { Card } from '@/components/ui';
import { Pill, AlertTriangle, Shield, Clock, Users, Info, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Understanding Mental Health Medications | Baltimore Mental Health Navigator',
  description: 'Learn about mental health medications, their proper use, safety considerations, and important warnings about misuse and abuse.',
};

export default function MedicationPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-h1 text-neutral-900">Understanding Mental Health Medications</h1>
              <p className="mt-4 text-body-lg text-neutral-600">
                Important information about medications used to treat mental health conditions, their proper use, and safety considerations
              </p>
            </div>
          </div>
        </section>

        {/* Critical Safety Warning */}
        <section className="section bg-error-50 border-t-4 border-t-error-600">
          <div className="container-app">
            <Card padding="lg" className="border-l-4 border-l-error-600">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-8 w-8 text-error-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-error-900 mb-3">CRITICAL SAFETY WARNING</h2>
                  <div className="space-y-3 text-neutral-700">
                    <p className="font-semibold">Mental health medications must ONLY be taken under the supervision of a licensed healthcare provider.</p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-error-600 font-bold mt-1">⚠</span>
                        <span><strong>Never take medications prescribed for someone else</strong> — what works for one person may be dangerous for another</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-error-600 font-bold mt-1">⚠</span>
                        <span><strong>Never share your prescribed medications</strong> with others — this is illegal and potentially life-threatening</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-error-600 font-bold mt-1">⚠</span>
                        <span><strong>Never stop taking medication suddenly</strong> without consulting your healthcare provider — this can cause dangerous withdrawal symptoms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-error-600 font-bold mt-1">⚠</span>
                        <span><strong>Never take more than prescribed</strong> — overdose can be fatal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-error-600 font-bold mt-1">⚠</span>
                        <span><strong>Never mix medications without provider approval</strong> — dangerous interactions can occur</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Abuse and Dependence Warning */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Understanding Medication Abuse & Dependence</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card padding="lg" className="border-l-4 border-l-error-500">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-error-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">High-Risk Medications</h3>
                </div>
                <p className="text-neutral-700 mb-4">Some mental health medications carry higher risks for misuse, dependence, and addiction:</p>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span><strong>Benzodiazepines</strong> (for anxiety): Can lead to physical dependence within weeks. Must be tapered slowly under medical supervision</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span><strong>Stimulants</strong> (for ADHD): Have potential for misuse. Should be stored securely and monitored carefully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span><strong>Sleep medications</strong>: Can cause dependence and dangerous behaviors during sleep</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span><strong>Opioid pain medications</strong> (sometimes used for depression): Highly addictive with severe withdrawal symptoms</span>
                  </li>
                </ul>
              </Card>

              <Card padding="lg" className="border-l-4 border-l-error-500">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-error-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Signs of Medication Misuse</h3>
                </div>
                <p className="text-neutral-700 mb-4">Seek help immediately if you or someone you know shows these signs:</p>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Taking more medication than prescribed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Taking medication more frequently than directed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Seeking prescriptions from multiple doctors ("doctor shopping")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Running out of medication early</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Changes in behavior, mood, or sleep patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Neglecting responsibilities to obtain or use medication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error-600 mt-1">•</span>
                    <span>Defensive or secretive behavior about medication use</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Types of Medications */}
        <section className="section">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Types of Mental Health Medications</h2>
            <p className="text-neutral-700 mb-8">
              Medications can play an important role in treating mental health conditions. They are often used in combination with psychotherapy and other treatments. It's important to work with a healthcare provider to develop a treatment plan that meets your individual needs.
            </p>

            <div className="space-y-6">
              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <Pill className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Antidepressants</h3>
                </div>
                <p className="text-neutral-700 mb-3">
                  Used to treat depression, anxiety disorders, and sometimes pain or insomnia. Common types include:
                </p>
                <ul className="space-y-2 text-neutral-700 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span><strong>SSRIs</strong> (Selective Serotonin Reuptake Inhibitors)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span><strong>SNRIs</strong> (Serotonin-Norepinephrine Reuptake Inhibitors)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span><strong>NDRIs</strong> (Norepinephrine-Dopamine Reuptake Inhibitors)</span>
                  </li>
                </ul>
                <div className="bg-accent-50 p-4 rounded-lg border-l-4 border-l-accent-500">
                  <p className="text-sm text-neutral-700">
                    <strong>Important:</strong> Antidepressants take 4-8 weeks to work fully. In some cases, children, teenagers, and young adults under 25 may experience increased suicidal thoughts when starting antidepressants. Close monitoring is essential during the first few weeks.
                  </p>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <Pill className="h-6 w-6 text-accent-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Anti-Anxiety Medications</h3>
                </div>
                <p className="text-neutral-700 mb-3">
                  Help reduce symptoms of anxiety such as panic attacks, extreme fear, and worry. Types include:
                </p>
                <ul className="space-y-2 text-neutral-700 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span><strong>SSRIs/SNRIs</strong> (long-term treatment)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span><strong>Benzodiazepines</strong> (short-term use only)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span><strong>Beta-blockers</strong> (for physical symptoms)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 mt-1">•</span>
                    <span><strong>Buspirone</strong> (long-term, non-addictive)</span>
                  </li>
                </ul>
                <div className="bg-error-50 p-4 rounded-lg border-l-4 border-l-error-500">
                  <p className="text-sm text-neutral-700 font-semibold mb-2">
                    <AlertTriangle className="inline h-4 w-4 mr-1" />ABUSE WARNING: Benzodiazepines
                  </p>
                  <p className="text-sm text-neutral-700">
                    Benzodiazepines can cause physical dependence and addiction, even when taken as prescribed. They should only be used short-term and must be tapered slowly under medical supervision. Combining with alcohol or opioids can be fatal.
                  </p>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <Pill className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Stimulants</h3>
                </div>
                <p className="text-neutral-700 mb-3">
                  Used to treat ADHD by increasing alertness, attention, and energy. While effective when used properly, stimulants require careful monitoring.
                </p>
                <div className="bg-error-50 p-4 rounded-lg border-l-4 border-l-error-500">
                  <p className="text-sm text-neutral-700 font-semibold mb-2">
                    <AlertTriangle className="inline h-4 w-4 mr-1" />ABUSE WARNING: Stimulants
                  </p>
                  <p className="text-sm text-neutral-700">
                    Stimulant medications have potential for misuse and diversion (selling or sharing). They should be stored securely and monitored carefully. Misuse can lead to cardiovascular problems, psychosis, and addiction. Never crush or snort pills.
                  </p>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <Pill className="h-6 w-6 text-accent-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Antipsychotics</h3>
                </div>
                <p className="text-neutral-700 mb-3">
                  Used to treat psychosis, schizophrenia, bipolar disorder, and severe depression. Available in first-generation (typical) and second-generation (atypical) forms.
                </p>
                <div className="bg-accent-50 p-4 rounded-lg border-l-4 border-l-accent-500">
                  <p className="text-sm text-neutral-700">
                    <strong>Important:</strong> Long-term use may cause involuntary muscle movements (tardive dyskinesia). Regular monitoring of weight, glucose, and lipid levels is typically required.
                  </p>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <Pill className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Mood Stabilizers</h3>
                </div>
                <p className="text-neutral-700 mb-3">
                  Used to treat bipolar disorder and sometimes depression. Include lithium and certain anticonvulsant medications.
                </p>
                <div className="bg-accent-50 p-4 rounded-lg border-l-4 border-l-accent-500">
                  <p className="text-sm text-neutral-700">
                    <strong>Important:</strong> Requires regular blood tests to monitor medication levels and kidney/thyroid function. Never adjust dosage without medical supervision.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Safe Medication Practices */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Safe Medication Practices</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-primary-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Before Starting Medication</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Tell your provider about ALL medications, vitamins, and supplements you're taking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Inform them about any allergies or past medication problems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Discuss your complete medical history, including substance use</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Ask about potential side effects and what to expect</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Understand how to take the medication correctly</span>
                  </li>
                </ul>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-accent-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">While Taking Medication</h3>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span>Take medication exactly as prescribed—same time each day</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span>Don't stop suddenly, even if you feel better</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span>Keep all follow-up appointments and monitoring tests</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span>Report any side effects or concerns immediately</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span>Store medications securely, away from children and others</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span>Don't mix with alcohol or recreational drugs</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* What to Know */}
        <section className="section">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Important Things to Know</h2>
            <Card padding="lg" className="mb-6">
              <div className="space-y-4 text-neutral-700">
                <p className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Medications affect everyone differently.</strong> It may take several tries to find the right medication with the fewest side effects.</span>
                </p>
                <p className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Most medications take time to work.</strong> It's important to give the medication a fair trial (usually 4-8 weeks) before deciding if it's effective.</span>
                </p>
                <p className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Side effects often improve with time.</strong> Many side effects are temporary and diminish as your body adjusts.</span>
                </p>
                <p className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Stopping medication requires medical guidance.</strong> Your body needs time to adjust when discontinuing medication to avoid withdrawal symptoms.</span>
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Get Help Section */}
        <section className="section bg-crisis-50 border-t-4 border-t-crisis-600">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Need Help With Medication Concerns?</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card padding="lg">
                <h3 className="font-semibold text-neutral-900 mb-3">If You're Experiencing Problems</h3>
                <p className="text-neutral-700 mb-3">Contact your healthcare provider immediately if you:</p>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-crisis-600 mt-1">•</span>
                    <span>Have severe side effects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-crisis-600 mt-1">•</span>
                    <span>Experience new or worsening symptoms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-crisis-600 mt-1">•</span>
                    <span>Have thoughts of self-harm or suicide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-crisis-600 mt-1">•</span>
                    <span>Suspect medication misuse or dependence</span>
                  </li>
                </ul>
              </Card>

              <Card padding="lg">
                <h3 className="font-semibold text-neutral-900 mb-3">Emergency Resources</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl font-bold text-crisis-600">988</span>
                    <div>
                      <p className="font-semibold text-neutral-900">Suicide & Crisis Lifeline</p>
                      <p className="text-sm text-neutral-600">For mental health crises</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl font-bold text-crisis-600">911</span>
                    <div>
                      <p className="font-semibold text-neutral-900">Emergency Services</p>
                      <p className="text-sm text-neutral-600">For life-threatening situations or overdose</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl font-bold text-crisis-600">1-800-662-4357</span>
                    <div>
                      <p className="font-semibold text-neutral-900">SAMHSA National Helpline</p>
                      <p className="text-sm text-neutral-600">For substance abuse and medication concerns</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="section bg-white">
          <div className="container-app">
            <h2 className="text-h2 text-neutral-900 mb-6">Additional Resources</h2>
            <div className="space-y-4">
              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <Link href="/navigator" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">Find Prescribing Providers</h3>
                  <p className="text-sm text-neutral-600">Use our navigator to find psychiatrists and other providers who can prescribe medication</p>
                </Link>
              </Card>

              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <a href="https://www.fda.gov/drugs/drug-safety-and-availability/medication-guides" target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">FDA Medication Guides</h3>
                  <p className="text-sm text-neutral-600">Official medication information, warnings, and approved uses from the FDA</p>
                </a>
              </Card>

              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <a href="https://medlineplus.gov/druginformation.html" target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">MedlinePlus Drug Information</h3>
                  <p className="text-sm text-neutral-600">Comprehensive information on medications, including side effects and interactions</p>
                </a>
              </Card>

              <Card padding="md" variant="outlined" className="hover:border-primary-300 transition-colors">
                <Link href="/resources/cost-insurance" className="block">
                  <h3 className="font-semibold text-neutral-900 mb-1">Understanding Medication Costs</h3>
                  <p className="text-sm text-neutral-600">Learn about insurance coverage and assistance programs for medications</p>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="section bg-neutral-100">
          <div className="container-app">
            <Card padding="md" className="text-center">
              <p className="text-sm text-neutral-600">
                <strong>Important Disclaimer:</strong> This page provides basic information about mental health medications for educational purposes only. 
                It is not a complete source for all medications and should not be used as a guide when making medical decisions. 
                Always consult with a qualified healthcare provider about your specific situation.
                <br /><br />
                <strong>Source:</strong> Information based on the National Institute of Mental Health (NIMH) and U.S. Food and Drug Administration (FDA) guidelines.
              </p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
