'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CrisisBanner } from '@/components/layout/crisis-banner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Building2, Loader2, CheckCircle, XCircle, Eye } from 'lucide-react';

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  provider_type: string;
  credentials: string[];
  city: string;
  state: string;
  zip_code: string;
  is_active: boolean;
  is_verified: boolean;
  photo_url: string | null;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'providers' | 'organizations' | 'claims' | 'articles'>('providers');
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'pending' | 'active' | 'rejected'>('pending');
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Check authentication on mount
  React.useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated');
    if (!authenticated) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const pendingCount = providers.filter(p => !p.is_active && !p.is_verified).length;
  const activeCount = providers.filter(p => p.is_active).length;

  const stats = [
    {
      label: 'Pending Providers',
      value: loading ? '...' : pendingCount.toString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Active Providers',
      value: loading ? '...' : activeCount.toString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Organizations',
      value: '0',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Pending Claims',
      value: '0',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  React.useEffect(() => {
    fetchProviders();
  }, [statusFilter]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      // Direct Supabase query since we're using simple auth
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      let query = supabase
        .from('providers')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by status
      if (statusFilter === 'pending') {
        query = query.eq('is_active', false).eq('is_verified', false);
      } else if (statusFilter === 'active') {
        query = query.eq('is_active', true);
      } else if (statusFilter === 'rejected') {
        query = query.eq('is_active', false).eq('is_verified', true);
      }
      // 'all' shows everything - no filter

      const { data, error } = await query;

      console.log('Fetch result:', { statusFilter, data, error });

      if (error) {
        console.error('Database error:', error);
        alert(`Failed to fetch providers: ${error.message}`);
      } else if (data) {
        console.log(`Found ${data.length} providers`);
        setProviders(data);
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      alert('Failed to fetch providers. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (providerId: string) => {
    setProcessingId(providerId);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      // Get provider details
      const { data: provider, error: fetchError } = await supabase
        .from('providers')
        .select('email, first_name, last_name')
        .eq('id', providerId)
        .single();

      if (fetchError) {
        console.error('Failed to fetch provider:', fetchError);
        alert('Failed to fetch provider details');
        setProcessingId(null);
        return;
      }

      // Update provider status
      const { error } = await supabase
        .from('providers')
        .update({ is_active: true, is_verified: true })
        .eq('id', providerId);
      
      if (error) {
        console.error('Failed to approve provider:', error);
        alert('Failed to approve provider');
      } else {
        // Send approval email
        try {
          const response = await fetch('/api/admin/send-approval-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              providerName: `${provider.first_name} ${provider.last_name}`,
              providerEmail: provider.email,
            }),
          });

          if (!response.ok) {
            console.error('Failed to send approval email');
          }
        } catch (emailError) {
          console.error('Email send error:', emailError);
        }

        alert(`Provider approved! Approval email sent to ${provider.email}`);
        fetchProviders();
      }
    } catch (error) {
      console.error('Failed to approve provider:', error);
      alert('Failed to approve provider');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (providerId: string) => {
    setProcessingId(providerId);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { error } = await supabase
        .from('providers')
        .update({ is_active: false, is_verified: true })
        .eq('id', providerId);
      
      if (error) {
        console.error('Failed to reject provider:', error);
      } else {
        fetchProviders();
      }
    } catch (error) {
      console.error('Failed to reject provider:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeactivate = async (providerId: string) => {
    if (!confirm('Are you sure you want to deactivate this provider? They will no longer appear in search results.')) {
      return;
    }
    
    setProcessingId(providerId);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { error } = await supabase
        .from('providers')
        .update({ is_active: false })
        .eq('id', providerId);
      
      if (error) {
        console.error('Failed to deactivate provider:', error);
        alert('Failed to deactivate provider');
      } else {
        alert('Provider deactivated successfully');
        fetchProviders();
      }
    } catch (error) {
      console.error('Failed to deactivate provider:', error);
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main className="container-app py-12">
        <div className="mb-8">
          <h1 className="text-h1 text-neutral-900">Admin Dashboard</h1>
          <p className="mt-2 text-body text-neutral-600">
            Manage providers, organizations, and content
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} padding="lg">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.label}</p>
                  <p className="text-h2 text-neutral-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-neutral-200">
          <nav className="flex gap-8">
            {[
              { id: 'providers', label: 'Providers' },
              { id: 'organizations', label: 'Organizations' },
              { id: 'claims', label: 'Claims' },
              { id: 'articles', label: 'Articles' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'providers' && (
          <Card padding="lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-h3 text-neutral-900">Provider Management</h2>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-sm"
                >
                  <option value="pending">Pending Review</option>
                  <option value="active">Active</option>
                  <option value="rejected">Rejected</option>
                  <option value="all">All</option>
                </select>
                <Button variant="outline" size="sm">
                  Export List
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : providers.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <p>No providers found with status: {statusFilter}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="rounded-lg border border-neutral-200 p-4 hover:border-neutral-300 transition-colors">
                    <div className="flex items-start gap-4">
                      {provider.photo_url ? (
                        <img
                          src={provider.photo_url}
                          alt={`${provider.first_name} ${provider.last_name}`}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-neutral-200 flex items-center justify-center">
                          <Users className="h-8 w-8 text-neutral-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {provider.first_name} {provider.last_name}
                              {provider.credentials && provider.credentials.length > 0 && (
                                <span className="text-sm font-normal text-neutral-600">
                                  , {provider.credentials.join(', ')}
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-neutral-600 capitalize">
                              {provider.provider_type?.replace('_', ' ')} • {provider.city}, {provider.state}
                            </p>
                            <p className="text-sm text-neutral-600">
                              {provider.email} {provider.phone && `• ${provider.phone}`}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              {provider.is_active ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                  <CheckCircle className="h-3 w-3" />
                                  Active
                                </span>
                              ) : provider.is_verified ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                  <XCircle className="h-3 w-3" />
                                  Rejected
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                                  <Loader2 className="h-3 w-3" />
                                  Pending Review
                                </span>
                              )}
                              <span className="text-xs text-neutral-500">
                                Submitted {new Date(provider.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`/providers/${provider.id}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {/* Show Approve/Reject for pending providers */}
                            {!provider.is_active && !provider.is_verified && (
                              <>
                                <Button 
                                  size="sm"
                                  onClick={() => handleApprove(provider.id)}
                                  disabled={processingId === provider.id}
                                >
                                  {processingId === provider.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    'Approve'
                                  )}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleReject(provider.id)}
                                  disabled={processingId === provider.id}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            {/* Show Deactivate for active providers */}
                            {provider.is_active && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeactivate(provider.id)}
                                disabled={processingId === provider.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                {processingId === provider.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Deactivate'
                                )}
                              </Button>
                            )}
                            
                            {/* Show Re-approve for rejected providers */}
                            {!provider.is_active && provider.is_verified && (
                              <Button 
                                size="sm"
                                onClick={() => handleApprove(provider.id)}
                                disabled={processingId === provider.id}
                              >
                                {processingId === provider.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Re-approve'
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'organizations' && (
          <Card padding="lg">
            <h2 className="text-h3 text-neutral-900 mb-4">Organizations</h2>
            <p className="text-neutral-600">Organization management features coming soon...</p>
          </Card>
        )}

        {activeTab === 'claims' && (
          <Card padding="lg">
            <h2 className="text-h3 text-neutral-900 mb-4">Profile Claims</h2>
            <p className="text-neutral-600">Claim management features coming soon...</p>
          </Card>
        )}

        {activeTab === 'articles' && (
          <Card padding="lg">
            <h2 className="text-h3 text-neutral-900 mb-4">Articles & Resources</h2>
            <p className="text-neutral-600">Content management features coming soon...</p>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
