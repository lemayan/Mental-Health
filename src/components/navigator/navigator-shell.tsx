'use client';

import * as React from 'react';
import Link from 'next/link';
import { useNavigator } from './navigator-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Loader2, Home } from 'lucide-react';

interface NavigatorShellProps {
  children: React.ReactNode;
}

export function NavigatorShell({ children }: NavigatorShellProps) {
  const {
    currentStep,
    totalSteps,
    canProceed,
    nextStep,
    prevStep,
    isSubmitting,
    submit,
  } = useNavigator();

  const progressPercent = (currentStep / totalSteps) * 100;
  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    if (isLastStep) {
      submit();
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Progress Header */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="container-app py-4">
          <div className="flex items-center justify-between">
            {currentStep === totalSteps ? (
              <>
                <div className="w-24" /> {/* Spacer */}
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-lg bg-error-50 px-4 py-2 text-sm font-semibold text-error-600 hover:bg-error-100 hover:text-error-700 transition-all shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
                <div className="w-24" /> {/* Spacer */}
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={cn(
                      'inline-flex items-center gap-1 text-sm font-medium transition-colors',
                      currentStep === 1
                        ? 'text-neutral-300 cursor-not-allowed'
                        : 'text-neutral-600 hover:text-neutral-900'
                    )}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <div className="h-4 w-px bg-neutral-300" />
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-error-600 hover:bg-error-50 hover:text-error-700 transition-all"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </div>

                <span className="text-sm font-medium text-neutral-600">
                  Step {currentStep} of {totalSteps}
                </span>

                <div className="w-24" /> {/* Spacer for alignment */}
              </>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={currentStep}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container-app py-8 md:py-12">
        <div className="mx-auto max-w-2xl">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 border-t border-neutral-200 bg-white safe-bottom">
        <div className="container-app py-4">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="hidden sm:inline-flex"
            >
              Back
            </Button>
            <div className="hidden sm:block" /> {/* Spacer on mobile */}

            <Button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              rightIcon={
                isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )
              }
              fullWidth
              className="sm:w-auto"
            >
              {isSubmitting
                ? 'Finding matches...'
                : isLastStep
                ? 'See my matches'
                : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
