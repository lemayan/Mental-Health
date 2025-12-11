'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CrisisBanner, Navbar, Footer } from '@/components/layout';
import { Card, Button, Input } from '@/components/ui';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function ProviderLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const emailToSearch = email.toLowerCase().trim();
      console.log('Searching for email:', emailToSearch);
      
      // Find provider by email - try with ilike for case-insensitive search
      const { data: providers, error: fetchError } = await supabase
        .from('providers')
        .select('*')
        .ilike('email', emailToSearch);

      console.log('Query result:', { providers, fetchError });

      if (fetchError) {
        console.error('Database error:', fetchError);
        setError(`Database error: ${fetchError.message}`);
        setLoading(false);
        return;
      }

      if (!providers || providers.length === 0) {
        setError('No account found with this email. Please check and try again.');
        setLoading(false);
        return;
      }

      const provider = providers[0];

      // Store provider session
      localStorage.setItem('provider_id', provider.id);
      localStorage.setItem('provider_authenticated', 'true');
      
      console.log('Login successful, redirecting...');
      
      // Redirect to provider panel
      router.push('/provider-panel');
    } catch (err) {
      console.error('Login error:', err);
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main className="container-app py-12">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-h1 text-neutral-900 mb-2">Provider Login</h1>
            <p className="text-body text-neutral-600">
              Access your provider dashboard
            </p>
          </div>

          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="pl-10"
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  Enter the email you used when registering your provider profile
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Access Dashboard'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <p className="text-sm text-neutral-600 text-center">
                Don't have a profile yet?{' '}
                <button
                  onClick={() => router.push('/for-providers/create')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Create one here
                </button>
              </p>
            </div>

            <div className="mt-4">
              <p className="text-xs text-neutral-500 text-center">
                Need help?{' '}
                <a
                  href="mailto:support@baltimoremhn.org"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Contact support
                </a>
              </p>
            </div>
          </Card>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">✨ Simple Email Login</h3>
            <p className="text-xs text-blue-700">
              We use a simple email-based login system. Just enter the email address you used when creating your provider profile to access your dashboard.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
