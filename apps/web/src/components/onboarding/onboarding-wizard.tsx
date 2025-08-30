"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";
import { fetchWithCSRF } from "@/lib/csrf";
import { OnboardingWelcome } from "./steps/onboarding-welcome";
import { OnboardingOrganization } from "./steps/onboarding-organization";
import { OnboardingProfile } from "./steps/onboarding-profile";
import { OnboardingTour } from "./steps/onboarding-tour";
import { OnboardingInvite } from "./steps/onboarding-invite";
import { OnboardingProgress } from "./onboarding-progress";

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  { key: "welcome", component: OnboardingWelcome },
  { key: "organization", component: OnboardingOrganization },
  { key: "profile", component: OnboardingProfile },
  { key: "tour", component: OnboardingTour },
  { key: "invite", component: OnboardingInvite },
];

export function OnboardingWizard({
  isOpen,
  onClose,
  onComplete,
}: OnboardingWizardProps) {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      loadProgress();
    }
  }, [isOpen, session?.user?.id]);

  const loadProgress = async () => {
    try {
      const response = await fetch("/api/onboarding/progress");
      const data = await response.json();
      if (data.success) {
        setProgress(data);
        // Find the first incomplete step
        const incompleteStep = data.progress.findIndex(
          (p: any) => !p.completed && !p.skipped
        );
        if (incompleteStep !== -1) {
          setCurrentStep(incompleteStep);
        }
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const handleNext = async (stepData?: any) => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      const currentStepKey = ONBOARDING_STEPS[currentStep].key;
      const response = await fetchWithCSRF("/api/onboarding/skip", {
        method: "POST",
        body: JSON.stringify({ step: currentStepKey }),
      });

      if (response.ok) {
        await loadProgress();
        if (currentStep < ONBOARDING_STEPS.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          await handleComplete();
        }
      }
    } catch (error) {
      console.error("Error skipping step:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const currentStepKey = ONBOARDING_STEPS[currentStep].key;
      const response = await fetchWithCSRF("/api/onboarding/complete", {
        method: "POST",
        body: JSON.stringify({ step: currentStepKey }),
      });

      if (response.ok) {
        onComplete();
        onClose();
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = async (stepData?: any) => {
    setLoading(true);
    try {
      const currentStepKey = ONBOARDING_STEPS[currentStep].key;
      const response = await fetchWithCSRF("/api/onboarding/complete", {
        method: "POST",
        body: JSON.stringify({
          step: currentStepKey,
          data: stepData,
        }),
      });

      if (response.ok) {
        await loadProgress();
        handleNext(stepData);
      }
    } catch (error) {
      console.error("Error completing step:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const CurrentStepComponent = ONBOARDING_STEPS[currentStep].component;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const canSkip = progress?.progress?.[currentStep]?.step?.required === false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="zap" className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Welcome to Your SaaS Platform
              </h2>
              <p className="text-sm text-gray-500">Let's get you set up</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Icon name="x" className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={ONBOARDING_STEPS.length}
          progress={progress}
        />

        {/* Step Content */}
        <div className="p-6">
          <CurrentStepComponent
            onComplete={handleStepComplete}
            onSkip={handleSkip}
            loading={loading}
            progress={progress}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={loading}
              >
                <Icon name="arrow-left" className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            {canSkip && (
              <Button variant="ghost" onClick={handleSkip} disabled={loading}>
                Skip
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              I'll do this later
            </Button>
            {isLastStep && (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? (
                  <>
                    <Icon
                      name="refresh-cw"
                      className="w-4 h-4 mr-2 animate-spin"
                    />
                    Completing...
                  </>
                ) : (
                  <>
                    <Icon name="check" className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
