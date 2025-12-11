'use client';

import * as React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CrisisBanner } from '@/components/layout/crisis-banner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Users,
  MapPin,
  Shield,
  Target,
  Lightbulb,
  ArrowRight,
  Mail,
  Loader2,
  CheckCircle,
} from 'lucide-react';

export default function AboutPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create mailto link with form data
    const mailtoLink = `mailto:info@baltimoremhn.org?subject=${encodeURIComponent(formData.subject || 'Contact Form Submission')}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success message
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-display text-balance text-neutral-900">
                Making mental health support accessible to all Baltimore residents
              </h1>
              <p className="mt-6 text-body-lg text-neutral-600">
                Baltimore Mental Health Navigator is a free community resource that helps connect people with therapists, community programs, and support services across the Baltimore area.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="section bg-white">
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-h2 text-neutral-900">Our Mission</h2>
              <p className="mt-4 text-body-lg text-neutral-700">
                We believe everyone deserves access to mental health support, regardless of their insurance status, neighborhood, or familiarity with the mental health system.
              </p>
              <p className="mt-4 text-neutral-600">
                Baltimore has incredible mental health resources — community centers, private practices, peer support groups, and more. But finding the right fit can be overwhelming, especially when you&apos;re already struggling.
              </p>
              <p className="mt-4 text-neutral-600">
                That&apos;s why we built the Mental Health Navigator: a simple tool that asks a few questions about your needs and connects you with options that actually fit — whether that&apos;s a therapist who takes your insurance, a free support group in your neighborhood, or crisis resources when you need them most.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section bg-neutral-50">
          <div className="container-app">
            <h2 className="text-center text-h2 text-neutral-900">What We Believe</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card padding="lg" className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100">
                  <Target className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-h4 text-neutral-900">Access for All</h3>
                <p className="mt-2 text-neutral-600">
                  Mental health support should be accessible regardless of income, insurance, or zip code.
                </p>
              </Card>

              <Card padding="lg" className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-100">
                  <Lightbulb className="h-7 w-7 text-accent-600" />
                </div>
                <h3 className="text-h4 text-neutral-900">Clarity Over Confusion</h3>
                <p className="mt-2 text-neutral-600">
                  Navigating mental health care shouldn&apos;t require a degree. We make information clear and actionable.
                </p>
              </Card>

              <Card padding="lg" className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-support-100">
                  <Heart className="h-7 w-7 text-support-600" />
                </div>
                <h3 className="text-h4 text-neutral-900">Community First</h3>
                <p className="mt-2 text-neutral-600">
                  We&apos;re built by and for the Baltimore community, with input from residents, providers, and local organizations.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section bg-white">
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-h2 text-neutral-900">How It Works</h2>
              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">We gather information</h3>
                    <p className="mt-1 text-neutral-600">
                      We compile provider information from public directories, direct submissions, and community partnerships. All provider profiles are verified before going live.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">We match you locally</h3>
                    <p className="mt-1 text-neutral-600">
                      Our navigator asks about your needs, location, and preferences to show you relevant options in your area — not a generic national database.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <Shield className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Your privacy is protected</h3>
                    <p className="mt-1 text-neutral-600">
                      We don&apos;t sell your data or share your information with anyone except the providers you choose to contact. Period.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="section bg-neutral-50">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-h2 text-neutral-900">Our Partners</h2>
              <p className="mt-4 text-neutral-600">
                We work with community organizations, healthcare systems, and local government to ensure our directory is comprehensive and up-to-date.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-8 opacity-60">
                {/* Placeholder for partner logos */}
                <div className="h-12 w-32 rounded bg-neutral-300" />
                <div className="h-12 w-32 rounded bg-neutral-300" />
                <div className="h-12 w-32 rounded bg-neutral-300" />
                <div className="h-12 w-32 rounded bg-neutral-300" />
              </div>
              <p className="mt-8 text-sm text-neutral-500">
                Interested in partnering with us?{' '}
                <a href="mailto:partnerships@baltimoremhn.org" className="text-primary-600 hover:underline">
                  Get in touch
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="section relative overflow-hidden bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50">
          {/* Animated background elements */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-24 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
          
          <div className="container-app relative">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 mb-6 shadow-xl transform hover:scale-105 transition-transform">
                  <Mail className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-h1 text-neutral-900 mb-4">Let&apos;s Connect</h2>
                <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                  We&apos;re here to listen and help. Share your thoughts, questions, or feedback with us.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 backdrop-blur-sm border border-white/20">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 mb-6 animate-bounce-slow">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-3">Message Sent!</h3>
                    <p className="text-neutral-600 text-lg mb-6">
                      Your email client has opened. We&apos;ll get back to you within 24 hours! 💙
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      size="lg"
                      variant="outline"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="group">
                        <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                          Your Name *
                        </label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            className="block h-14 w-full rounded-xl border-2 border-neutral-200 bg-neutral-50 pl-12 pr-4 text-base text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="block h-14 w-full rounded-xl border-2 border-neutral-200 bg-neutral-50 pl-12 pr-4 text-base text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                        Subject *
                      </label>
                      <div className="relative">
                        <Heart className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="How can we help you today?"
                          className="block h-14 w-full rounded-xl border-2 border-neutral-200 bg-neutral-50 pl-12 pr-4 text-base text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Tell us what's on your mind..."
                        className="block w-full rounded-xl border-2 border-neutral-200 bg-neutral-50 px-4 py-4 text-base text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 hover:from-primary-700 hover:via-primary-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                      rightIcon={isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                    >
                      {isSubmitting ? 'Opening your email...' : 'Send Message'}
                    </Button>

                    <p className="text-center text-sm text-neutral-500 mt-4">
                      We typically respond within 24 hours • Your privacy is protected 🔒
                    </p>
                  </form>
                )}
              </div>

              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                <a 
                  href="mailto:info@baltimoremhn.org"
                  className="group relative overflow-hidden rounded-xl border-2 border-white bg-white/80 backdrop-blur-sm p-6 hover:border-primary-300 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 group-hover:bg-primary-200 transition-colors mb-3">
                      <Mail className="h-6 w-6 text-primary-600" />
                    </div>
                    <p className="text-base font-semibold text-neutral-900 mb-1">General Inquiries</p>
                    <p className="text-sm text-primary-600 font-medium">info@baltimoremhn.org</p>
                  </div>
                </a>
                <a 
                  href="mailto:partnerships@baltimoremhn.org"
                  className="group relative overflow-hidden rounded-xl border-2 border-white bg-white/80 backdrop-blur-sm p-6 hover:border-primary-300 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors mb-3">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-base font-semibold text-neutral-900 mb-1">Partnerships</p>
                    <p className="text-sm text-purple-600 font-medium">partnerships@baltimoremhn.org</p>
                  </div>
                </a>
                <a 
                  href="mailto:support@baltimoremhn.org"
                  className="group relative overflow-hidden rounded-xl border-2 border-white bg-white/80 backdrop-blur-sm p-6 hover:border-primary-300 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-pink-100 group-hover:bg-pink-200 transition-colors mb-3">
                      <Heart className="h-6 w-6 text-pink-600" />
                    </div>
                    <p className="text-base font-semibold text-neutral-900 mb-1">Support</p>
                    <p className="text-sm text-pink-600 font-medium">support@baltimoremhn.org</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-white">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-h2 text-neutral-900">Ready to find support?</h2>
              <p className="mt-2 text-neutral-600">
                Take our quick questionnaire to find mental health resources that fit your needs.
              </p>
              <Link href="/navigator" className="mt-6 inline-block">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
