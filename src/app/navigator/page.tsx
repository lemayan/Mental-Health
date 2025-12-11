'use client';

import { 
  NavigatorProvider, 
  useNavigator,
  NavigatorShell,
  Step1PrimaryConcern,
  Step2HelpFor,
  Step3Urgency,
  Step4ServiceFormat,
  Step5Payment,
  Step6Location,
  Step7Preferences,
} from '@/components/navigator';

function NavigatorSteps() {
  const { currentStep, submitError } = useNavigator();

  return (
    <>
      {currentStep === 1 && <Step1PrimaryConcern />}
      {currentStep === 2 && <Step2HelpFor />}
      {currentStep === 3 && <Step3Urgency />}
      {currentStep === 4 && <Step4ServiceFormat />}
      {currentStep === 5 && <Step5Payment />}
      {currentStep === 6 && <Step6Location />}
      {currentStep === 7 && <Step7Preferences />}

      {submitError && (
        <div className="mt-6 rounded-lg bg-error-100 p-4 text-center text-sm text-error-700">
          {submitError}
        </div>
      )}
    </>
  );
}

export default function NavigatorPage() {
  return (
    <NavigatorProvider>
      <NavigatorShell>
        <NavigatorSteps />
      </NavigatorShell>
    </NavigatorProvider>
  );
}
