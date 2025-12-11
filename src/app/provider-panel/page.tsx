'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CrisisBanner, Navbar, Footer } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { MessagesList } from '@/components/provider/MessagesList';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  Heart,
  Image as ImageIcon,
  Inbox,
  BarChart3
} from 'lucide-react';

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  provider_type?: string;
  credentials?: string[];
  bio?: string;
  tagline?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  website?: string;
  photo_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  age_groups_served?: string[];
  service_formats?: string[];
  payment_types?: string[];
  insurance_accepted?: string[];
}

interface ProviderStats {
  profile_views: number;
  email_clicks: number;
  phone_clicks: number;
  website_clicks: number;
  total_interactions: number;
}

interface RecentInteraction {
  id: string;
  interaction_type: string;
  created_at: string;
  user_ip?: string;
  metadata?: any;
}

interface ProviderLike {
  id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  created_at: string;
}

export default function ProviderPanelPage() {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [stats, setStats] = useState<ProviderStats>({
    profile_views: 0,
    email_clicks: 0,
    phone_clicks: 0,
    website_clicks: 0,
    total_interactions: 0,
  });
  const [recentInteractions, setRecentInteractions] = useState<RecentInteraction[]>([]);
  const [likes, setLikes] = useState<ProviderLike[]>([]);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'inbox'>('overview');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Check if provider is logged in
    const providerId = localStorage.getItem('provider_id');
    const providerAuth = localStorage.getItem('provider_authenticated');
    
    if (!providerId || providerAuth !== 'true') {
      router.push('/provider-panel/login');
      return;
    }

    // Run all fetches in parallel
    Promise.all([
      fetchProviderData(providerId),
      fetchUnreadCount(providerId),
      fetchStats(providerId),
      fetchRecentInteractions(providerId),
      fetchLikes(providerId),
    ]).catch(err => {
      console.error('Error loading dashboard:', err);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProviderData = async (providerId: string) => {
    try {
      setLoading(true);
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('id', providerId)
        .single();

      if (error) {
        console.error('Failed to fetch provider:', error);
      } else if (data) {
        setProvider(data);
      }
    } catch (error) {
      console.error('Failed to fetch provider:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (providerId: string) => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('provider_interactions')
        .select('interaction_type')
        .eq('provider_id', providerId);

      if (!error && data) {
        const statsData: ProviderStats = {
          profile_views: data.filter(i => i.interaction_type === 'profile_view').length,
          email_clicks: data.filter(i => i.interaction_type === 'email_click').length,
          phone_clicks: data.filter(i => i.interaction_type === 'phone_click').length,
          website_clicks: data.filter(i => i.interaction_type === 'website_click').length,
          total_interactions: data.length,
        };
        setStats(statsData);
      } else if (error && !error.message.includes('does not exist')) {
        console.error('Failed to fetch stats:', error);
      }
      // If table doesn't exist, just keep default stats at 0
    } catch (error) {
      // Silently fail
    }
  };

  const fetchRecentInteractions = async (providerId: string) => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('provider_interactions')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setRecentInteractions(data);
      } else if (error && !error.message.includes('does not exist')) {
        console.error('Failed to fetch interactions:', error);
      }
      // If table doesn't exist, just keep empty array
    } catch (error) {
      // Silently fail
    }
  };

  const fetchLikes = async (providerId: string) => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('provider_likes')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLikes(data);
        setLikesCount(data.length);
      } else if (error && !error.message.includes('does not exist')) {
        console.error('Failed to fetch likes:', error);
      }
    } catch (error) {
      // Silently fail if table doesn't exist
    }
  };

  const fetchUnreadCount = async (providerId: string) => {
    try {
      const response = await fetch(`/api/provider/messages?provider_id=${providerId}`);
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      // Silently fail - inbox feature may not be set up yet
      setUnreadCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('provider_id');
    localStorage.removeItem('provider_authenticated');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <CrisisBanner />
        <Navbar />
        <main className="container-app py-12">
          <Card padding="lg">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-h2 text-neutral-900 mb-2">Profile Not Found</h2>
              <p className="text-neutral-600 mb-6">We couldn't find your provider profile.</p>
              <Button onClick={handleLogout}>Return to Home</Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = () => {
    console.log('Provider status:', { is_active: provider.is_active, is_verified: provider.is_verified });
    
    // Active = is_active is true (approved by admin)
    if (provider.is_active) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
          <CheckCircle className="h-4 w-4" />
          Active & Approved
        </span>
      );
    } else if (provider.is_verified) {
      // is_verified=true but is_active=false means rejected
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4" />
          Not Approved
        </span>
      );
    } else {
      // is_active=false and is_verified=false means pending
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
          <Clock className="h-4 w-4" />
          Pending Admin Approval
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main className="container-app py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-h1 text-neutral-900">Provider Dashboard</h1>
            <p className="mt-2 text-body text-neutral-600">
              Manage your profile and view your listing status
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Status Banner */}
        <Card padding="lg" className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusBadge()}
              <div>
                <p className="text-sm text-neutral-600">
                  Profile created on {new Date(provider.created_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.open(`/providers/${provider.id}`, '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Profile
              </Button>
              <Button onClick={() => router.push('/provider-panel/edit')}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-neutral-200">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 relative ${
                activeTab === 'inbox'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                Inbox
                {unreadCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Info Message */}
        {!provider.is_active && !provider.is_verified && (
          <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">Pending Review</h3>
                <p className="text-sm text-orange-700">
                  Your profile is currently being reviewed by our admin team. You'll be notified once it's approved and published to the directory.
                </p>
              </div>
            </div>
          </div>
        )}

        {!provider.is_active && provider.is_verified && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Profile Not Approved</h3>
                <p className="text-sm text-red-700">
                  Your profile was not approved. Please contact support@baltimoremhn.org for more information.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Inbox Tab */}
        {activeTab === 'inbox' && (
          <MessagesList providerId={provider.id} />
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card padding="lg" className="lg:col-span-2">
            <h2 className="text-h3 text-neutral-900 mb-6">Profile Information</h2>
            
            <div className="space-y-6">
              {/* Photo and Basic Info */}
              <div className="flex gap-6">
                {provider.photo_url ? (
                  <img
                    src={provider.photo_url}
                    alt={`${provider.first_name} ${provider.last_name}`}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-neutral-200 flex items-center justify-center">
                    <User className="h-12 w-12 text-neutral-400" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="text-h3 text-neutral-900">
                    {provider.first_name} {provider.last_name}
                    {provider.credentials && provider.credentials.length > 0 && (
                      <span className="text-lg font-normal text-neutral-600">
                        , {provider.credentials.join(', ')}
                      </span>
                    )}
                  </h3>
                  <p className="text-neutral-600 capitalize mt-1">
                    {provider.provider_type?.replace('_', ' ')}
                  </p>
                  {provider.tagline && (
                    <p className="text-sm text-neutral-600 mt-2 italic">"{provider.tagline}"</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              {provider.bio && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">About</h4>
                  <p className="text-neutral-600">{provider.bio}</p>
                </div>
              )}

              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-neutral-600">
                    <Mail className="h-4 w-4 text-neutral-400" />
                    <span>{provider.email}</span>
                  </div>
                  {provider.phone && (
                    <div className="flex items-center gap-3 text-neutral-600">
                      <Phone className="h-4 w-4 text-neutral-400" />
                      <span>{provider.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-neutral-600">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    <span>
                      {provider.address_line1}
                      {provider.address_line2 && `, ${provider.address_line2}`}
                      <br />
                      {provider.city}, {provider.state} {provider.zip_code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="grid gap-4 sm:grid-cols-2">
                {provider.age_groups_served && provider.age_groups_served.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 mb-2">Age Groups</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.age_groups_served.map((age) => (
                        <span key={age} className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                          {age}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {provider.service_formats && provider.service_formats.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 mb-2">Service Formats</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.service_formats.map((format) => (
                        <span key={format} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment */}
              {provider.payment_types && provider.payment_types.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">Payment Options</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.payment_types.map((type) => (
                      <span key={type} className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Insurance */}
              {provider.insurance_accepted && provider.insurance_accepted.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">Insurance Accepted</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.insurance_accepted.map((insurance) => (
                      <span key={insurance} className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                        {insurance}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Profile Likes */}
            <Card padding="lg" className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <h3 className="text-h4 text-neutral-900">Profile Likes</h3>
              </div>
              <p className="text-3xl font-bold text-red-600 mb-2">{likesCount}</p>
              <p className="text-sm text-neutral-600">
                {likesCount === 0 ? 'No likes yet' : likesCount === 1 ? '1 person has liked your profile!' : `${likesCount} people have liked your profile!`}
              </p>
            </Card>

            <Card padding="lg">
              <h3 className="text-h4 text-neutral-900 mb-4">Engagement Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Profile Views</span>
                  <span className="text-h4 text-primary-600">{stats.profile_views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Email Clicks</span>
                  <span className="text-h4 text-green-600">{stats.email_clicks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Phone Clicks</span>
                  <span className="text-h4 text-blue-600">{stats.phone_clicks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Website Clicks</span>
                  <span className="text-h4 text-purple-600">{stats.website_clicks}</span>
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-900">Total Interactions</span>
                    <span className="text-h3 text-neutral-900">{stats.total_interactions}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-h4 text-neutral-900 mb-4">Recent Activity</h3>
              {recentInteractions.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">
                  No activity yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentInteractions.slice(0, 5).map((interaction) => (
                    <div key={interaction.id} className="flex items-start gap-3 text-sm">
                      <div className="flex-1">
                        <p className="text-neutral-900 font-medium capitalize">
                          {interaction.interaction_type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {new Date(interaction.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card padding="lg">
              <h3 className="text-h4 text-neutral-900 mb-4">Need Help?</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Have questions about your profile or need assistance?
              </p>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = 'mailto:support@baltimoremhn.org'}>
                Contact Support
              </Button>
            </Card>
          </div>
        </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
