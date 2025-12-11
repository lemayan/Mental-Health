'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CrisisBanner, Navbar, Footer } from '@/components/layout';
import { Card, Button, Input } from '@/components/ui';
import { ArrowLeft, Loader2, Upload, CheckCircle } from 'lucide-react';
import { uploadProviderPhoto, validateImageFile } from '@/lib/uploadPhoto';

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  gender?: string;
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
  languages?: string[];
  issues_treated?: string[];
  age_groups_served?: string[];
  service_formats?: string[];
  payment_types?: string[];
  insurance_accepted?: string[];
  availability_status?: string;
}

export default function EditProviderPage() {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    const providerId = localStorage.getItem('provider_id');
    const providerAuth = localStorage.getItem('provider_authenticated');
    
    if (!providerId || providerAuth !== 'true') {
      router.push('/provider-panel/login');
      return;
    }

    fetchProviderData(providerId);
  }, [router]);

  const fetchProviderData = async (providerId: string) => {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('id', providerId)
        .single();

      if (error) {
        console.error('Failed to fetch provider:', error);
        setError('Failed to load profile');
      } else if (data) {
        setProvider(data);
        if (data.photo_url) {
          setPhotoPreview(data.photo_url);
        }
      }
    } catch (error) {
      console.error('Failed to fetch provider:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setPhotoError(validation.error || 'Invalid file');
        setPhotoPreview(null);
        setPhotoFile(null);
        return;
      }

      setPhotoError(null);
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      // Upload photo if changed
      let photoUrl = provider?.photo_url || null;
      if (photoFile) {
        try {
          photoUrl = await uploadProviderPhoto(photoFile, provider?.id);
        } catch (uploadError) {
          throw new Error(`Photo upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
      }

      // Get checkbox values
      const languages = formData.getAll('languages');
      const issuesTreated = formData.getAll('issues_treated');
      const ageGroupsServed = formData.getAll('age_groups_served');
      const serviceFormats = formData.getAll('service_formats');
      const paymentTypes = formData.getAll('payment_types');
      const insuranceAccepted = formData.getAll('insurance_accepted');

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('providers')
        .update({
          first_name: formData.get('firstName'),
          last_name: formData.get('lastName'),
          phone: formData.get('phone'),
          gender: formData.get('gender'),
          provider_type: formData.get('providerType'),
          credentials: formData.get('credentials') ? [formData.get('credentials')] : [],
          bio: formData.get('bio'),
          tagline: formData.get('tagline'),
          address_line1: formData.get('address_line1'),
          address_line2: formData.get('address_line2'),
          city: formData.get('city'),
          state: formData.get('state'),
          zip_code: formData.get('zip_code'),
          website: formData.get('website'),
          photo_url: photoUrl,
          languages: languages,
          issues_treated: issuesTreated,
          age_groups_served: ageGroupsServed,
          service_formats: serviceFormats,
          payment_types: paymentTypes,
          insurance_accepted: insuranceAccepted,
          availability_status: formData.get('availability_status'),
        })
        .eq('id', provider?.id);

      if (updateError) {
        throw new Error('Failed to update profile');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/provider-panel');
      }, 2000);

    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
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
            <p className="text-center text-neutral-600">Profile not found</p>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main className="container-app py-12">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/provider-panel')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Dashboard
          </Button>
        </div>

        <Card padding="lg" className="max-w-3xl mx-auto">
          <h1 className="text-h2 text-neutral-900 mb-6">Edit Profile</h1>

          {success && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-700">Profile updated successfully!</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Profile photo
              </label>
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-neutral-100 border-2 border-neutral-200">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-neutral-400">
                      <Upload className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block w-full text-sm text-neutral-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {photoError && (
                    <p className="mt-2 text-xs text-red-600">{photoError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="First name"
                name="firstName"
                required
                defaultValue={provider.first_name}
              />
              <Input
                label="Last name"
                name="lastName"
                required
                defaultValue={provider.last_name}
              />
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              defaultValue={provider.email}
              disabled
              helperText="Email cannot be changed"
            />

            <Input
              label="Phone"
              name="phone"
              type="tel"
              defaultValue={provider.phone}
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Gender <span className="text-error-600">*</span>
              </label>
              <select
                name="gender"
                required
                defaultValue={provider.gender || ''}
                className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non_binary">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Provider type <span className="text-error-600">*</span>
              </label>
              <select
                name="providerType"
                required
                defaultValue={provider.provider_type || ''}
                className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="">Select type</option>
                <option value="therapist">Therapist</option>
                <option value="psychiatrist">Psychiatrist</option>
                <option value="psychologist">Psychologist</option>
                <option value="counselor">Counselor</option>
                <option value="social_worker">Social Worker</option>
                <option value="nurse_practitioner">Nurse Practitioner</option>
                <option value="peer_specialist">Peer Specialist</option>
              </select>
            </div>

            <Input
              label="Professional credentials"
              name="credentials"
              placeholder="e.g., LCSW, PhD, MD"
              defaultValue={provider.credentials?.[0]}
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Bio <span className="text-error-600">*</span>
              </label>
              <textarea
                name="bio"
                required
                rows={6}
                defaultValue={provider.bio}
                className="block w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="Tell potential clients about your approach and experience..."
              />
            </div>

            <Input
              label="Tagline"
              name="tagline"
              defaultValue={provider.tagline}
              placeholder="e.g., Compassionate therapy for anxiety and depression"
            />

            {/* Address */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Address <span className="text-error-600">*</span>
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  name="address_line1"
                  required
                  defaultValue={provider.address_line1}
                  placeholder="Street address"
                  className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
                <input
                  type="text"
                  name="address_line2"
                  defaultValue={provider.address_line2 || ''}
                  placeholder="Apt, suite, etc. (optional)"
                  className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    type="text"
                    name="city"
                    required
                    defaultValue={provider.city}
                    placeholder="City"
                    className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    type="text"
                    name="state"
                    required
                    defaultValue={provider.state}
                    placeholder="State"
                    className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    type="text"
                    name="zip_code"
                    required
                    defaultValue={provider.zip_code}
                    placeholder="ZIP code"
                    className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Languages spoken <span className="text-error-600">*</span>
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {['English', 'Spanish', 'Mandarin', 'French', 'Arabic', 'Korean'].map((lang) => (
                  <label key={lang} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="languages"
                      value={lang.toLowerCase()}
                      defaultChecked={provider.languages?.includes(lang.toLowerCase())}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                    />
                    <span className="text-sm text-neutral-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Issues */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Issues you treat <span className="text-error-600">*</span>
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {['Anxiety', 'Depression', 'Trauma/PTSD', 'Grief/Loss', 'Relationships', 'Substance Abuse'].map((issue) => (
                  <label key={issue} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="issues_treated"
                      value={issue.toLowerCase().replace(/\//g, '_').replace(/\s+/g, '_')}
                      defaultChecked={provider.issues_treated?.includes(issue.toLowerCase().replace(/\//g, '_').replace(/\s+/g, '_'))}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                    />
                    <span className="text-sm text-neutral-700">{issue}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Age Groups */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Age groups you serve <span className="text-error-600">*</span>
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {['Children (0-12)', 'Teens (13-17)', 'Adults (26-64)', 'Seniors (65+)'].map((age) => (
                  <label key={age} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="age_groups_served"
                      value={age.toLowerCase().split(' ')[0]}
                      defaultChecked={provider.age_groups_served?.includes(age.toLowerCase().split(' ')[0])}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                    />
                    <span className="text-sm text-neutral-700">{age}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Service Formats */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Service formats <span className="text-error-600">*</span>
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {['In-person', 'Telehealth', 'Phone'].map((format) => (
                  <label key={format} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="service_formats"
                      value={format.toLowerCase().replace('-', '_')}
                      defaultChecked={provider.service_formats?.includes(format.toLowerCase().replace('-', '_'))}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                    />
                    <span className="text-sm text-neutral-700">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Types */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Payment types <span className="text-error-600">*</span>
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {['Medicaid', 'Medicare', 'Private Insurance', 'Sliding Scale', 'Self-Pay'].map((payment) => (
                  <label key={payment} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="payment_types"
                      value={payment.toLowerCase().replace(/\s+/g, '_')}
                      defaultChecked={provider.payment_types?.includes(payment.toLowerCase().replace(/\s+/g, '_'))}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                    />
                    <span className="text-sm text-neutral-700">{payment}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Insurance */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Insurance accepted
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {['Aetna', 'Anthem', 'BCBS', 'CareFirst', 'Cigna', 'Medicaid', 'Medicare', 'UnitedHealthcare'].map((ins) => (
                  <label key={ins} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="insurance_accepted"
                      value={ins}
                      defaultChecked={provider.insurance_accepted?.includes(ins)}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                    />
                    <span className="text-sm text-neutral-700">{ins}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Availability <span className="text-error-600">*</span>
              </label>
              <select
                name="availability_status"
                required
                defaultValue={provider.availability_status || 'accepting_new_clients'}
                className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="accepting_new_clients">Accepting new clients</option>
                <option value="waitlist">Waitlist available</option>
                <option value="limited_availability">Limited availability</option>
                <option value="not_accepting">Not accepting new clients</option>
              </select>
            </div>

            <Input
              label="Website"
              name="website"
              type="url"
              defaultValue={provider.website}
              placeholder="https://your-website.com"
            />

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/provider-panel')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
