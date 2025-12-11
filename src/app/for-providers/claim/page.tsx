'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Loader2,
} from 'lucide-react';

interface ProviderMatch {
  id: string;
  name: string;
  credentials: string[];
  provider_type: string;
  photo_url: string | null;
}

export default function ClaimProviderPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<ProviderMatch[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<ProviderMatch | null>(null);
  const [claimEmail, setClaimEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/onboarding/search?query=${encodeURIComponent(searchQuery)}`
      );
      const result = await response.json();

      if (response.ok) {
        setSearchResults(result.data.matches || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider || !claimEmail) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/onboarding/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: selectedProvider.id,
          verification_email: claimEmail,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(result.error?.message || 'Failed to submit claim');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="container-app py-16">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-neutral-900">
              Claim submitted!
            </h1>
            <p className="mt-4 text-neutral-600">
              We&apos;ll review your claim within 2 business days and send a
              verification email to <strong>{claimEmail}</strong>.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Once verified, you&apos;ll be able to edit your profile and start
              receiving inquiries.
            </p>
            <div className="mt-8">
              <Link href="/">
                <Button variant="outline">Return home</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Claim form for selected provider
  if (selectedProvider) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="container-app py-8">
          <button
            type="button"
            onClick={() => setSelectedProvider(null)}
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </button>

          <div className="mx-auto max-w-lg">
            <h1 className="text-2xl font-bold text-neutral-900">
              Claim your profile
            </h1>
            <p className="mt-2 text-neutral-600">
              Verify that you are {selectedProvider.name} to claim this profile.
            </p>

            {/* Selected provider card */}
            <Card padding="md" className="mt-6">
              <div className="flex items-center gap-4">
                {selectedProvider.photo_url ? (
                  <img
                    src={selectedProvider.photo_url}
                    alt=""
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <User className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-neutral-900">
                    {selectedProvider.name}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {selectedProvider.provider_type}
                  </p>
                </div>
              </div>
            </Card>

            {/* Claim form */}
            <form onSubmit={handleClaim} className="mt-8 space-y-6">
              <Input
                label="Your professional email"
                type="email"
                placeholder="you@practice.com"
                value={claimEmail}
                onChange={(e) => setClaimEmail(e.target.value)}
                helperText="We'll send a verification link to this email address."
                required
              />

              {submitError && (
                <div className="rounded-lg bg-error-100 p-4 text-sm text-error-700">
                  {submitError}
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Submit claim
              </Button>

              <p className="text-center text-sm text-neutral-500">
                By submitting, you confirm that you are the provider listed above
                and agree to our{' '}
                <a href="/terms" className="text-primary-600 hover:underline">
                  Terms of Service
                </a>
                .
              </p>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Search state
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="container-app py-8">
        <Link
          href="/for-providers"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold text-neutral-900">
            Claim your profile
          </h1>
          <p className="mt-2 text-neutral-600">
            Search for your name to see if we already have a profile for you.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="mt-8">
            <div className="flex gap-3">
              <Input
                placeholder="Search by your name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
                className="flex-1"
              />
              <Button type="submit" isLoading={isSearching}>
                Search
              </Button>
            </div>
          </form>

          {/* Results */}
          {hasSearched && (
            <div className="mt-8">
              {isSearching ? (
                <div className="py-8 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-500" />
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <p className="text-sm text-neutral-600">
                    {searchResults.length} profile{searchResults.length !== 1 ? 's' : ''} found
                  </p>
                  <div className="mt-4 space-y-3">
                    {searchResults.map((provider) => (
                      <Card
                        key={provider.id}
                        variant="interactive"
                        padding="md"
                        onClick={() => setSelectedProvider(provider)}
                      >
                        <div className="flex items-center gap-4">
                          {provider.photo_url ? (
                            <img
                              src={provider.photo_url}
                              alt=""
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                              <User className="h-5 w-5" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-neutral-900">
                              {provider.name}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {provider.provider_type}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-neutral-400" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
                  <p className="text-neutral-600">
                    No profiles found matching &quot;{searchQuery}&quot;
                  </p>
                  <p className="mt-2 text-sm text-neutral-500">
                    If you don&apos;t see your profile, you can create a new one.
                  </p>
                  <Link href="/for-providers/create">
                    <Button variant="outline" className="mt-4">
                      Create new profile
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Not found prompt */}
          {!hasSearched && (
            <div className="mt-12 text-center">
              <p className="text-sm text-neutral-500">
                Don&apos;t have an existing profile?{' '}
                <Link
                  href="/for-providers/create"
                  className="text-primary-600 hover:underline"
                >
                  Create a new one
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
