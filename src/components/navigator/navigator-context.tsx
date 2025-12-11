'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { NavigatorSubmitInput } from '@/lib/validations';

// Navigator form state
export interface NavigatorState {
  // Step 1: Primary concern
  primaryConcern: string | null;
  // Step 2: Who is this for
  helpFor: string | null;
  // Step 3: Urgency
  urgency: string | null;
  // Step 4: Service format
  serviceFormat: string | null;
  // Step 5: Payment
  paymentType: string | null;
  insuranceProvider: string | null;
  // Step 6: Location
  zipCode: string;
  // Step 7: Preferences (optional)
  providerGenderPreference: string | null;
  languagePreference: string | null;
  openToCommunityPrograms: boolean;
}

const initialState: NavigatorState = {
  primaryConcern: null,
  helpFor: null,
  urgency: null,
  serviceFormat: null,
  paymentType: null,
  insuranceProvider: null,
  zipCode: '',
  providerGenderPreference: null,
  languagePreference: null,
  openToCommunityPrograms: true,
};

interface NavigatorContextValue {
  state: NavigatorState;
  currentStep: number;
  totalSteps: number;
  updateState: (updates: Partial<NavigatorState>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  canProceed: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  submit: () => Promise<void>;
  reset: () => void;
}

const NavigatorContext = React.createContext<NavigatorContextValue | null>(null);

export function useNavigator() {
  const context = React.useContext(NavigatorContext);
  if (!context) {
    throw new Error('useNavigator must be used within NavigatorProvider');
  }
  return context;
}

interface NavigatorProviderProps {
  children: React.ReactNode;
}

export function NavigatorProvider({ children }: NavigatorProviderProps) {
  const router = useRouter();
  const [state, setState] = React.useState<NavigatorState>(initialState);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const totalSteps = 7;

  const updateState = React.useCallback((updates: Partial<NavigatorState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Check if current step has required data to proceed
  const canProceed = React.useMemo(() => {
    switch (currentStep) {
      case 1:
        return !!state.primaryConcern;
      case 2:
        return !!state.helpFor;
      case 3:
        return !!state.urgency;
      case 4:
        return !!state.serviceFormat;
      case 5:
        return !!state.paymentType;
      case 6:
        return state.zipCode.length === 5;
      case 7:
        return true; // Optional step
      default:
        return false;
    }
  }, [currentStep, state]);

  const nextStep = React.useCallback(() => {
    if (currentStep < totalSteps && canProceed) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, canProceed]);

  const prevStep = React.useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = React.useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, []);

  const submit = React.useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: NavigatorSubmitInput = {
        primary_concern: state.primaryConcern as any,
        help_for: state.helpFor as any,
        urgency: state.urgency as any,
        service_format: state.serviceFormat as any,
        payment_type: state.paymentType as any,
        insurance_provider: state.insuranceProvider as any || undefined,
        zip_code: state.zipCode,
        provider_gender_preference: state.providerGenderPreference as any || undefined,
        language_preference: state.languagePreference as any || undefined,
        open_to_community_programs: state.openToCommunityPrograms,
      };

      const response = await fetch('/api/navigator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to submit');
      }

      // Redirect to results page
      router.push(result.data.results_url);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [state, router]);

  const reset = React.useCallback(() => {
    setState(initialState);
    setCurrentStep(1);
    setSubmitError(null);
  }, []);

  const value = React.useMemo(
    () => ({
      state,
      currentStep,
      totalSteps,
      updateState,
      nextStep,
      prevStep,
      goToStep,
      canProceed,
      isSubmitting,
      submitError,
      submit,
      reset,
    }),
    [
      state,
      currentStep,
      updateState,
      nextStep,
      prevStep,
      goToStep,
      canProceed,
      isSubmitting,
      submitError,
      submit,
      reset,
    ]
  );

  return (
    <NavigatorContext.Provider value={value}>
      {children}
    </NavigatorContext.Provider>
  );
}
