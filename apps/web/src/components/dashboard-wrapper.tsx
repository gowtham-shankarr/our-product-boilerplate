"use client";

import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { Button } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const {
    showOnboarding,
    onboardingCompleted,
    loading,
    openOnboarding,
    closeOnboarding,
    completeOnboarding,
  } = useOnboarding();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Icon name="refresh-cw" className="w-4 h-4 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      {children}

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard
          isOpen={showOnboarding}
          onClose={closeOnboarding}
          onComplete={completeOnboarding}
        />
      )}

      {/* Onboarding Reminder Banner */}
      {!showOnboarding && !onboardingCompleted && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="zap" className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  Complete Your Setup
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Finish setting up your account to get the most out of the
                  platform.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={openOnboarding} className="flex-1">
                    Get Started
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => completeOnboarding()}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
