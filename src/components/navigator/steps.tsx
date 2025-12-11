'use client';

import * as React from 'react';
import { useNavigator } from './navigator-context';
import { OptionCard, OptionGrid } from './option-card';
import { CrisisAlert } from '@/components/layout/crisis-banner';
import { Input } from '@/components/ui/input';
import {
  Frown,
  Brain,
  Heart,
  Pill,
  Users,
  HelpCircle,
  User,
  Baby,
  UserCircle,
  Home,
  Clock,
  AlertTriangle,
  Video,
  Building2,
  Shuffle,
  CreditCard,
  Shield,
  Wallet,
  CircleDollarSign,
} from 'lucide-react';

// Step Layout Component
interface StepLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function StepLayout({ title, subtitle, children }: StepLayoutProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-h1 text-balance text-neutral-900">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-body-lg text-neutral-600">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// Step 1: Primary Concern
export function Step1PrimaryConcern() {
  const { state, updateState } = useNavigator();

  const options = [
    {
      value: 'anxiety',
      label: 'Stress or anxiety',
      description: 'Worry, nervousness, feeling overwhelmed',
      icon: <Brain className="h-5 w-5" />,
    },
    {
      value: 'depression',
      label: 'Sadness or depression',
      description: 'Low mood, loss of interest, hopelessness',
      icon: <Frown className="h-5 w-5" />,
    },
    {
      value: 'trauma',
      label: 'Trauma or difficult experiences',
      description: 'Past events that still affect you',
      icon: <Heart className="h-5 w-5" />,
    },
    {
      value: 'addiction',
      label: 'Addiction or substance use',
      description: 'Alcohol, drugs, or other dependencies',
      icon: <Pill className="h-5 w-5" />,
    },
    {
      value: 'child_behavior',
      label: 'Teen or child behavior or mood',
      description: 'Concerns about a young person',
      icon: <Users className="h-5 w-5" />,
    },
    {
      value: 'not_sure',
      label: "I'm not sure",
      description: "That's okay — we can still help you explore",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  return (
    <StepLayout
      title="What do you need help with?"
      subtitle="Choose the option that feels closest to what you're experiencing."
    >
      <OptionGrid columns={2}>
        {options.map((option) => (
          <OptionCard
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            selected={state.primaryConcern === option.value}
            onSelect={(value) => updateState({ primaryConcern: value })}
          />
        ))}
      </OptionGrid>
    </StepLayout>
  );
}

// Step 2: Who is this for
export function Step2HelpFor() {
  const { state, updateState } = useNavigator();

  const options = [
    {
      value: 'adult',
      label: 'Adult (18 or older)',
      icon: <User className="h-5 w-5" />,
    },
    {
      value: 'teen',
      label: 'Teen (13 to 17)',
      icon: <UserCircle className="h-5 w-5" />,
    },
    {
      value: 'child',
      label: 'Child (12 or younger)',
      icon: <Baby className="h-5 w-5" />,
    },
    {
      value: 'couple',
      label: 'Couple',
      icon: <Users className="h-5 w-5" />,
    },
    {
      value: 'family',
      label: 'Family',
      icon: <Home className="h-5 w-5" />,
    },
  ];

  return (
    <StepLayout
      title="Who is this help for?"
      subtitle="Select the option that best describes who will be receiving care."
    >
      <OptionGrid>
        {options.map((option) => (
          <OptionCard
            key={option.value}
            value={option.value}
            label={option.label}
            icon={option.icon}
            selected={state.helpFor === option.value}
            onSelect={(value) => updateState({ helpFor: value })}
          />
        ))}
      </OptionGrid>
    </StepLayout>
  );
}

// Step 3: Urgency
export function Step3Urgency() {
  const { state, updateState } = useNavigator();

  const options = [
    {
      value: 'urgent',
      label: 'In the next few days',
      icon: <Clock className="h-5 w-5" />,
    },
    {
      value: 'soon',
      label: 'In the next few weeks',
      icon: <Clock className="h-5 w-5" />,
    },
    {
      value: 'moderate',
      label: 'In the next month or two',
      icon: <Clock className="h-5 w-5" />,
    },
    {
      value: 'exploring',
      label: "I'm just exploring options",
      icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      value: 'crisis',
      label: 'I think I might be in crisis',
      icon: <AlertTriangle className="h-5 w-5" />,
    },
  ];

  return (
    <StepLayout
      title="How soon do you need help?"
      subtitle="This helps us prioritize providers who can see you sooner."
    >
      <OptionGrid>
        {options.map((option) => (
          <OptionCard
            key={option.value}
            value={option.value}
            label={option.label}
            icon={option.icon}
            selected={state.urgency === option.value}
            onSelect={(value) => updateState({ urgency: value })}
          />
        ))}
      </OptionGrid>

      {state.urgency === 'crisis' && (
        <div className="mt-6">
          <CrisisAlert />
        </div>
      )}
    </StepLayout>
  );
}

// Step 4: Service Format
export function Step4ServiceFormat() {
  const { state, updateState } = useNavigator();

  const options = [
    {
      value: 'in_person',
      label: 'In person',
      description: 'Meet face-to-face at an office',
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      value: 'online',
      label: 'Online (video or phone)',
      description: 'Talk from home via video or call',
      icon: <Video className="h-5 w-5" />,
    },
    {
      value: 'either',
      label: 'Either is fine',
      description: 'Show me all available options',
      icon: <Shuffle className="h-5 w-5" />,
    },
  ];

  return (
    <StepLayout
      title="How would you like to meet?"
      subtitle="Many providers offer both options. Choose what works best for you."
    >
      <OptionGrid>
        {options.map((option) => (
          <OptionCard
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            selected={state.serviceFormat === option.value}
            onSelect={(value) => updateState({ serviceFormat: value })}
          />
        ))}
      </OptionGrid>
    </StepLayout>
  );
}

// Step 5: Payment
export function Step5Payment() {
  const { state, updateState } = useNavigator();

  const options = [
    {
      value: 'medicaid',
      label: 'Medicaid',
      description: 'Includes Maryland Medicaid plans',
      icon: <Shield className="h-5 w-5" />,
    },
    {
      value: 'medicare',
      label: 'Medicare',
      icon: <Shield className="h-5 w-5" />,
    },
    {
      value: 'private_insurance',
      label: 'Private insurance',
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      value: 'self_pay',
      label: "I'll pay out of pocket",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      value: 'free',
      label: 'I need free or very low-cost options',
      icon: <CircleDollarSign className="h-5 w-5" />,
    },
  ];

  const insuranceOptions = [
    { value: 'aetna', label: 'Aetna' },
    { value: 'bluecross_blueshield', label: 'Blue Cross Blue Shield' },
    { value: 'carefirst', label: 'CareFirst' },
    { value: 'cigna', label: 'Cigna' },
    { value: 'united_healthcare', label: 'United Healthcare' },
    { value: 'humana', label: 'Humana' },
    { value: 'kaiser', label: 'Kaiser' },
    { value: 'tricare', label: 'TRICARE' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <StepLayout
      title="How do you plan to pay for care?"
      subtitle="We'll show you options that match your budget or insurance."
    >
      <OptionGrid>
        {options.map((option) => (
          <OptionCard
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            selected={state.paymentType === option.value}
            onSelect={(value) =>
              updateState({
                paymentType: value,
                insuranceProvider: value !== 'private_insurance' ? null : state.insuranceProvider,
              })
            }
          />
        ))}
      </OptionGrid>

      {state.paymentType === 'private_insurance' && (
        <div className="mt-6">
          <label
            htmlFor="insurance-select"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Which insurance plan do you have?
          </label>
          <select
            id="insurance-select"
            value={state.insuranceProvider || ''}
            onChange={(e) => updateState({ insuranceProvider: e.target.value || null })}
            className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="">Select your insurance</option>
            {insuranceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </StepLayout>
  );
}

// Step 6: Location
export function Step6Location() {
  const { state, updateState } = useNavigator();
  const [suggestions, setSuggestions] = React.useState<Array<{ zipCode: string; location: string }>>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [locationName, setLocationName] = React.useState<string | null>(null);

  // Import the zip code utilities
  const getZipCodeSuggestions = (partialZip: string) => {
    if (!partialZip || partialZip.length === 0) return [];
    
    const baltimoreZipCodes: Record<string, string> = {
      '21201': 'Downtown Baltimore / Inner Harbor',
      '21202': 'Downtown East / Little Italy',
      '21205': 'Highlandtown / Canton / Patterson Park',
      '21206': 'Hamilton / Lauraville / Gardenville',
      '21207': 'Gwynn Oak / Windsor Hills',
      '21208': 'Pikesville / Owings Mills',
      '21209': 'Mount Washington / Cheswolde',
      '21210': 'Roland Park / Hampden / Cross Keys',
      '21211': 'Charles Village / Remington / Old Goucher',
      '21212': 'Govans / Homeland / Waverly',
      '21213': 'Clifton Park / Belair-Edison',
      '21214': 'Hamilton / Parkville / Overlea',
      '21215': 'Park Heights / Arlington / Hilton',
      '21216': 'West Baltimore / Mondawmin',
      '21217': 'Druid Heights / Reservoir Hill',
      '21218': 'Barclay / Greenmount East / Johnston Square',
      '21223': 'Westport / Cherry Hill / Brooklyn',
      '21224': 'Highlandtown / Canton / Greektown',
      '21225': 'Brooklyn / Curtis Bay',
      '21226': 'Brooklyn Park / Ferndale / Pumphrey',
      '21227': 'Halethorpe / Arbutus',
      '21228': 'Catonsville / Woodlawn / Rolling Road',
      '21229': 'Catonsville / Westview / Windsor Mill',
      '21230': 'Federal Hill / Locust Point / Riverside',
      '21231': 'Fells Point / Upper Fells Point',
      '21234': 'Parkville / Carney / Overlea',
      '21236': 'Nottingham / White Marsh / Perry Hall',
      '21237': 'Rosedale / Middle River',
      '21244': 'Windsor Mill / Woodlawn / Randallstown',
      '21286': 'Towson',
      '21043': 'Ellicott City',
      '21044': 'Columbia',
      '21060': 'Glen Burnie',
      '21401': 'Annapolis',
    };
    
    const results: Array<{ zipCode: string; location: string }> = [];
    Object.entries(baltimoreZipCodes).forEach(([zipCode, location]) => {
      if (zipCode.startsWith(partialZip)) {
        results.push({ zipCode, location });
      }
    });
    
    return results.slice(0, 8);
  };

  const getLocationByZipCode = (zipCode: string): string | null => {
    const baltimoreZipCodes: Record<string, string> = {
      '21201': 'Downtown Baltimore / Inner Harbor',
      '21202': 'Downtown East / Little Italy',
      '21205': 'Highlandtown / Canton / Patterson Park',
      '21206': 'Hamilton / Lauraville / Gardenville',
      '21207': 'Gwynn Oak / Windsor Hills',
      '21208': 'Pikesville / Owings Mills',
      '21209': 'Mount Washington / Cheswolde',
      '21210': 'Roland Park / Hampden / Cross Keys',
      '21211': 'Charles Village / Remington / Old Goucher',
      '21212': 'Govans / Homeland / Waverly',
      '21213': 'Clifton Park / Belair-Edison',
      '21214': 'Hamilton / Parkville / Overlea',
      '21215': 'Park Heights / Arlington / Hilton',
      '21216': 'West Baltimore / Mondawmin',
      '21217': 'Druid Heights / Reservoir Hill',
      '21218': 'Barclay / Greenmount East / Johnston Square',
      '21223': 'Westport / Cherry Hill / Brooklyn',
      '21224': 'Highlandtown / Canton / Greektown',
      '21225': 'Brooklyn / Curtis Bay',
      '21226': 'Brooklyn Park / Ferndale / Pumphrey',
      '21227': 'Halethorpe / Arbutus',
      '21228': 'Catonsville / Woodlawn / Rolling Road',
      '21229': 'Catonsville / Westview / Windsor Mill',
      '21230': 'Federal Hill / Locust Point / Riverside',
      '21231': 'Fells Point / Upper Fells Point',
      '21234': 'Parkville / Carney / Overlea',
      '21236': 'Nottingham / White Marsh / Perry Hall',
      '21237': 'Rosedale / Middle River',
      '21244': 'Windsor Mill / Woodlawn / Randallstown',
      '21286': 'Towson',
      '21043': 'Ellicott City',
      '21044': 'Columbia',
      '21060': 'Glen Burnie',
      '21401': 'Annapolis',
    };
    return baltimoreZipCodes[zipCode] || null;
  };

  const handleZipCodeChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 5);
    updateState({ zipCode: cleanValue });
    
    // Get suggestions if user is typing
    if (cleanValue.length > 0 && cleanValue.length < 5) {
      const newSuggestions = getZipCodeSuggestions(cleanValue);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
      setLocationName(null);
    } else if (cleanValue.length === 5) {
      // Check for exact match
      const location = getLocationByZipCode(cleanValue);
      setLocationName(location);
      setShowSuggestions(false);
      setSuggestions([]);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
      setLocationName(null);
    }
  };

  const handleSuggestionClick = (zipCode: string, location: string) => {
    updateState({ zipCode });
    setLocationName(location);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <StepLayout
      title="Where are you located?"
      subtitle="Enter your ZIP code so we can show options near you."
    >
      <div className="mx-auto max-w-sm">
        <div className="relative">
          <Input
            label="ZIP code"
            placeholder="e.g., 21201"
            value={state.zipCode}
            onChange={(e) => handleZipCodeChange(e.target.value)}
            helperText="We use your location only to show nearby options."
            maxLength={5}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          
          {/* Location name display for completed ZIP code */}
          {locationName && state.zipCode.length === 5 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
              <Home className="h-4 w-4" />
              <span className="font-medium">{locationName}</span>
            </div>
          )}
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.zipCode}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.zipCode, suggestion.location)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-neutral-100 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <Home className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900">{suggestion.zipCode}</div>
                      <div className="text-sm text-neutral-600">{suggestion.location}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-neutral-100 p-3">
          <Shield className="h-5 w-5 shrink-0 text-neutral-500" />
          <p className="text-sm text-neutral-600">
            We don&apos;t share your location with providers until you contact them.
          </p>
        </div>
      </div>
    </StepLayout>
  );
}

// Step 7: Preferences
export function Step7Preferences() {
  const { state, updateState } = useNavigator();

  const genderOptions = [
    { value: 'no_preference', label: 'No preference' },
    { value: 'woman', label: 'Woman' },
    { value: 'man', label: 'Man' },
    { value: 'nonbinary', label: 'Nonbinary' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  const languageOptions = [
    { value: '', label: 'No preference' },
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'mandarin', label: 'Mandarin' },
    { value: 'korean', label: 'Korean' },
    { value: 'vietnamese', label: 'Vietnamese' },
    { value: 'american_sign_language', label: 'American Sign Language' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <StepLayout
      title="Any preferences?"
      subtitle="These are optional but can help us find a better match."
    >
      <div className="space-y-6">
        {/* Gender preference */}
        <div>
          <label
            htmlFor="gender-preference"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Provider gender preference
          </label>
          <select
            id="gender-preference"
            value={state.providerGenderPreference || 'no_preference'}
            onChange={(e) =>
              updateState({
                providerGenderPreference:
                  e.target.value === 'no_preference' ? null : e.target.value,
              })
            }
            className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Language preference */}
        <div>
          <label
            htmlFor="language-preference"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Language preference
          </label>
          <select
            id="language-preference"
            value={state.languagePreference || ''}
            onChange={(e) =>
              updateState({
                languagePreference: e.target.value || null,
              })
            }
            className="block h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Community programs checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="community-programs"
            checked={state.openToCommunityPrograms}
            onChange={(e) =>
              updateState({ openToCommunityPrograms: e.target.checked })
            }
            className="mt-1 h-5 w-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
          />
          <label
            htmlFor="community-programs"
            className="text-base text-neutral-700"
          >
            I&apos;m open to community programs and support groups, not just
            one-to-one therapy.
          </label>
        </div>
      </div>
    </StepLayout>
  );
}
