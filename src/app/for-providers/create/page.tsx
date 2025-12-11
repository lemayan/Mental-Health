'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CrisisBanner } from '@/components/layout/crisis-banner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Loader2, Upload, CheckCircle } from 'lucide-react';
import { uploadProviderPhoto, validateImageFile } from '@/lib/uploadPhoto';

export default function CreateProviderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoError, setPhotoError] = React.useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = React.useState(false);
  const [selectedPaymentTypes, setSelectedPaymentTypes] = React.useState<string[]>([]);
  const [selectedInsurance, setSelectedInsurance] = React.useState<string[]>([]);

  const insuranceProviders = [
    'Aetna',
    'Aetna Better Health',
    'Aetna Medicare',
    'Affordable Care',
    'Allegiance Benefit Plan',
    'Allied Benefit Systems',
    'Allwell',
    'Amerigroup',
    'Amerihealth',
    'Amerihealth Caritas',
    'Anthem',
    'Anthem Blue Cross',
    'Anthem Blue Cross Blue Shield',
    'APWU Health Plan',
    'Beacon Health Options',
    'Blue Care Network',
    'Blue Cross',
    'Blue Cross Blue Shield',
    'Blue Cross Blue Shield Federal Employee Program',
    'Blue Shield',
    'Blue Shield of California',
    'Bright Health',
    'Capital Blue Cross',
    'CareFirst',
    'CareFirst BlueCross BlueShield',
    'Caresource',
    'Centene',
    'Cigna',
    'Cigna HealthSpring',
    'Coventry',
    'EBCBS (Empire Blue Cross Blue Shield)',
    'EmblemHealth',
    'Fidelis Care',
    'First Health',
    'Friday Health Plans',
    'Geisinger Health Plan',
    'Golden Rule',
    'Health Net',
    'Health Partners',
    'Healthfirst',
    'Highmark',
    'Highmark Blue Cross Blue Shield',
    'Horizon Blue Cross Blue Shield',
    'Humana',
    'Humana Medicare',
    'Independence Blue Cross',
    'Kaiser Foundation',
    'Kaiser Permanente',
    'Magellan Healthcare',
    'Maryland Medicaid',
    'Maryland Physicians Care',
    'MedCost',
    'Medicaid',
    'Medical Mutual',
    'Medicare',
    'Molina Healthcare',
    'Multiplan',
    'Optima Health',
    'Optum',
    'Oscar Health',
    'Oxford',
    'PHCS',
    'Priority Health',
    'Regence',
    'SCAN Health Plan',
    'Security Health Plan',
    'SelectHealth',
    'Tricare',
    'UMR',
    'United Behavioral Health',
    'United Healthcare',
    'United Healthcare Community Plan',
    'United Healthcare Medicare',
    'UnitedHealthcare',
    'UnitedHealthcare Student Resources',
    'UPMC Health Plan',
    'Value Options',
    'Wellcare',
    'Wellpoint',
    'Other'
  ];

  const [insuranceSearch, setInsuranceSearch] = React.useState('');
  const [showInsuranceSuggestions, setShowInsuranceSuggestions] = React.useState(false);

  const filteredInsuranceProviders = insuranceSearch.length > 0
    ? insuranceProviders.filter(ins => 
        ins.toLowerCase().includes(insuranceSearch.toLowerCase())
      )
    : insuranceProviders;

  const handlePaymentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedPaymentTypes([...selectedPaymentTypes, value]);
    } else {
      setSelectedPaymentTypes(selectedPaymentTypes.filter(t => t !== value));
    }
  };

  const handleInsuranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedInsurance([...selectedInsurance, value]);
    } else {
      setSelectedInsurance(selectedInsurance.filter(i => i !== value));
    }
    // Clear search and hide suggestions after selection
    setInsuranceSearch('');
    setShowInsuranceSuggestions(false);
  };

  const showInsuranceSection = !selectedPaymentTypes.includes('free');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate the file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setPhotoError(validation.error || 'Invalid file');
        setPhotoPreview(null);
        setPhotoFile(null);
        return;
      }

      setPhotoError(null);
      setPhotoFile(file);

      // Create preview
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
      // Step 1: Upload photo if provided
      let photoUrl: string | null = null;
      if (photoFile) {
        setUploadingPhoto(true);
        try {
          photoUrl = await uploadProviderPhoto(photoFile);
        } catch (uploadError) {
          throw new Error(`Photo upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        } finally {
          setUploadingPhoto(false);
        }
      }

      // Step 2: Get checkbox values
      const issuesTreated = formData.getAll('issues_treated');
      const ageGroupsServed = formData.getAll('age_groups_served');
      const serviceFormats = formData.getAll('service_formats');
      const paymentTypes = formData.getAll('payment_types');
      const languages = formData.getAll('languages');
      
      // Step 3: Prepare data for API
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        gender: formData.get('gender'),
        providerType: formData.get('providerType'),
        credentials: formData.get('credentials'),
        bio: formData.get('bio'),
        tagline: formData.get('tagline'),
        address_line1: formData.get('address_line1'),
        address_line2: formData.get('address_line2'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip_code: formData.get('zip_code'),
        languages: languages,
        issues_treated: issuesTreated,
        age_groups_served: ageGroupsServed,
        service_formats: serviceFormats,
        payment_types: paymentTypes,
        insurance_accepted: formData.get('insurance_accepted'),
        availability_status: formData.get('availability_status'),
        website: formData.get('website'),
        photo_url: photoUrl, // Use uploaded photo URL
      };

      // Step 4: Submit to API
      const response = await fetch('/api/onboarding/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Show detailed error for debugging
        console.error('API Error:', result);
        const errorMsg = result.error?.details 
          ? `${result.error.message}: ${JSON.stringify(result.error.details)}`
          : result.error?.message || 'Failed to create profile';
        throw new Error(errorMsg);
      }

      // Show success message and scroll to top
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // More confetti after a short delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push('/for-providers?success=created');
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <CrisisBanner />
      <Navbar />

      <main className="container-app py-12">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/for-providers"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to provider info
          </Link>

          <Card padding="lg">
            <div className="mb-8">
              <h1 className="text-h2 text-neutral-900">Create your provider profile</h1>
              <p className="mt-2 text-body text-neutral-600">
                Fill out the form below to create your profile. We&apos;ll review your submission and get back to you within 24 hours.
              </p>
            </div>

            {success && (
              <div className="mb-6 rounded-lg bg-green-50 border-2 border-green-500 p-6 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-1">
                      Profile Successfully Created!
                    </h3>
                    <p className="text-sm text-green-700">
                      Thank you for submitting your provider profile. We&apos;ll review your information and get back to you within 24 hours.
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Redirecting you shortly...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-lg bg-error-50 border border-error-200 p-4">
                <p className="text-sm text-error-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Profile photo
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full bg-neutral-100 border-2 border-neutral-200">
                    {photoPreview ? (
                      <>
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                        {photoFile && (
                          <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </>
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
                      name="photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="block w-full text-sm text-neutral-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100 file:cursor-pointer"
                      disabled={uploadingPhoto}
                    />
                    {photoError && (
                      <p className="mt-2 text-xs text-error-600">
                        {photoError}
                      </p>
                    )}
                    {!photoError && photoFile && (
                      <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Photo ready to upload
                      </p>
                    )}
                    {!photoError && !photoFile && (
                      <p className="mt-2 text-xs text-neutral-500">
                        Upload a professional photo (JPG, PNG, max 5MB)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  label="First name"
                  name="firstName"
                  required
                  placeholder="John"
                />
                <Input
                  label="Last name"
                  name="lastName"
                  required
                  placeholder="Doe"
                />
              </div>

              <Input
                label="Email"
                name="email"
                type="email"
                required
                placeholder="john.doe@example.com"
                helperText="We'll use this to contact you about your profile"
              />

              <Input
                label="Phone number"
                name="phone"
                type="tel"
                placeholder="(410) 555-1234"
              />

              <div>
                <label htmlFor="providerType" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Provider type <span className="text-error-600">*</span>
                </label>
                <select
                  id="providerType"
                  name="providerType"
                  required
                  className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="">Select provider type</option>
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
                label="Credentials"
                name="credentials"
                placeholder="e.g., LCSW-C, PhD, MD"
                helperText="Enter your professional credentials"
              />

              <div>
                <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Brief bio <span className="text-error-600">*</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  required
                  placeholder="Tell us about your practice and approach..."
                  className="block w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <Input
                label="Tagline"
                name="tagline"
                placeholder="e.g., Compassionate therapy for anxiety and depression"
                helperText="A brief one-line description of your practice"
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Address <span className="text-error-600">*</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="address_line1"
                    required
                    placeholder="Street address"
                    className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    type="text"
                    name="address_line2"
                    placeholder="Apt, suite, etc. (optional)"
                    className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      type="text"
                      name="city"
                      required
                      defaultValue="Baltimore"
                      placeholder="City"
                      className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                    <input
                      type="text"
                      name="state"
                      required
                      defaultValue="MD"
                      placeholder="State"
                      className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                    <input
                      type="text"
                      name="zip_code"
                      required
                      placeholder="ZIP code"
                      className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Gender <span className="text-error-600">*</span>
                </label>
                <select
                  name="gender"
                  required
                  className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non_binary">Non-binary</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
                <p className="mt-1 text-xs text-neutral-500">
                  Some clients have a preference for provider gender
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Languages spoken <span className="text-error-600">*</span>
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {['English', 'Spanish', 'Mandarin', 'French', 'Arabic', 'Korean', 'Vietnamese', 'Tagalog', 'Russian', 'Portuguese', 'Polish', 'Other'].map((lang) => (
                    <label key={lang} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="languages"
                        value={lang.toLowerCase()}
                        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                      />
                      <span className="text-sm text-neutral-700">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Issues you treat <span className="text-error-600">*</span>
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {['Anxiety', 'Depression', 'Trauma/PTSD', 'Grief/Loss', 'Relationships', 'Substance Abuse', 'ADHD', 'Bipolar Disorder', 'Eating Disorders', 'Stress Management', 'Anger Management', 'Self-Esteem', 'Life Transitions', 'Family Issues', 'LGBTQ+ Issues', 'OCD', 'Autism Spectrum', 'Sleep Issues'].map((issue) => (
                    <label key={issue} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="issues_treated"
                        value={issue.toLowerCase().replace(/\//g, '_').replace(/\+/g, '').replace(/\s+/g, '_')}
                        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                      />
                      <span className="text-sm text-neutral-700">{issue}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Age groups you serve <span className="text-error-600">*</span>
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {['Children (0-12)', 'Teens (13-17)', 'Young Adults (18-25)', 'Adults (26-64)', 'Seniors (65+)', 'Families', 'Couples'].map((age) => (
                    <label key={age} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="age_groups_served"
                        value={age.toLowerCase().split(' ')[0]}
                        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                      />
                      <span className="text-sm text-neutral-700">{age}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Service formats offered <span className="text-error-600">*</span>
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {['In-person', 'Telehealth', 'Phone'].map((format) => (
                    <label key={format} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="service_formats"
                        value={format.toLowerCase().replace('-', '_')}
                        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                      />
                      <span className="text-sm text-neutral-700">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Payment types accepted <span className="text-error-600">*</span>
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {['Medicaid', 'Medicare', 'Private Insurance', 'Sliding Scale', 'Self-Pay', 'Free'].map((payment) => (
                    <label key={payment} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="payment_types"
                        value={payment.toLowerCase().replace(/\s+/g, '_').replace('-', '_')}
                        onChange={handlePaymentTypeChange}
                        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                      />
                      <span className="text-sm text-neutral-700">{payment}</span>
                    </label>
                  ))}
                </div>
              </div>

              {showInsuranceSection && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Insurance providers accepted
                  </label>
                  
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search insurance providers..."
                      value={insuranceSearch}
                      onChange={(e) => {
                        setInsuranceSearch(e.target.value);
                        setShowInsuranceSuggestions(true);
                      }}
                      onFocus={() => setShowInsuranceSuggestions(true)}
                      onBlur={() => {
                        // Delay to allow click on checkbox to register
                        setTimeout(() => setShowInsuranceSuggestions(false), 200);
                      }}
                      className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                  </div>

                  {selectedInsurance.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {selectedInsurance.map((ins) => (
                        <span
                          key={ins}
                          className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700"
                        >
                          {ins}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInsurance(selectedInsurance.filter(i => i !== ins));
                              const checkbox = document.querySelector(`input[value="${ins}"]`) as HTMLInputElement;
                              if (checkbox) checkbox.checked = false;
                            }}
                            className="text-primary-700 hover:text-primary-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {showInsuranceSuggestions && (
                    <div className="max-h-64 overflow-y-auto rounded-lg border border-neutral-200 bg-white">
                      {filteredInsuranceProviders.length > 0 ? (
                        <div className="divide-y divide-neutral-100">
                          {filteredInsuranceProviders.map((insurance) => (
                            <label key={insurance} className="flex items-center gap-3 p-3 hover:bg-neutral-50 cursor-pointer">
                              <input
                                type="checkbox"
                                name="insurance_accepted"
                                value={insurance}
                                onChange={handleInsuranceChange}
                                checked={selectedInsurance.includes(insurance)}
                                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                              />
                              <span className="text-sm text-neutral-700">{insurance}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-neutral-500">
                          No insurance providers found matching "{insuranceSearch}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="availability_status" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Current availability <span className="text-error-600">*</span>
                </label>
                <select
                  id="availability_status"
                  name="availability_status"
                  required
                  className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="accepting_new_clients">Accepting new clients</option>
                  <option value="waitlist">Waitlist available</option>
                  <option value="limited_availability">Limited availability</option>
                  <option value="not_accepting">Not accepting new clients</option>
                </select>
              </div>

              <Input
                label="Website (optional)"
                name="website"
                type="url"
                placeholder="https://yourpractice.com"
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting || uploadingPhoto}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || uploadingPhoto}
                  rightIcon={isSubmitting || uploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                >
                  {uploadingPhoto ? 'Uploading photo...' : isSubmitting ? 'Submitting...' : 'Submit profile'}
                </Button>
              </div>
              
              {uploadingPhoto && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading your photo to secure storage...</span>
                </div>
              )}
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
