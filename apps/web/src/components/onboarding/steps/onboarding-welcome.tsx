"use client";

import { Button } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface OnboardingWelcomeProps {
  onComplete: (data?: any) => void;
  onSkip: () => void;
  loading: boolean;
  progress?: any;
}

export function OnboardingWelcome({
  onComplete,
  loading,
}: OnboardingWelcomeProps) {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Icon name="zap" className="w-8 h-8 text-blue-600" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">
          Welcome to Your SaaS Platform!
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We're excited to have you on board. Let's get you set up in just a few
          minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="text-center p-4 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="users" className="w-4 h-4 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-900">Set Up Organization</h4>
          <p className="text-sm text-gray-500">Configure your workspace</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="user" className="w-4 h-4 text-green-600" />
          </div>
          <h4 className="font-medium text-gray-900">Complete Profile</h4>
          <p className="text-sm text-gray-500">Add your information</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="users" className="w-4 h-4 text-purple-600" />
          </div>
          <h4 className="font-medium text-gray-900">Invite Team</h4>
          <p className="text-sm text-gray-500">Get your team onboard</p>
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={() => onComplete()}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Icon name="refresh-cw" className="w-4 h-4 mr-2 animate-spin" />
              Getting Started...
            </>
          ) : (
            <>
              Get Started
              <Icon name="arrow-right" className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
