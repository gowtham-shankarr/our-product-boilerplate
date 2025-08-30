"use client";

import { Button } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface OnboardingTourProps {
  onComplete: (data?: any) => void;
  onSkip: () => void;
  loading: boolean;
  progress?: any;
}

export function OnboardingTour({
  onComplete,
  onSkip,
  loading,
}: OnboardingTourProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
          <Icon name="map" className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Take a Quick Tour
        </h3>
        <p className="text-gray-600">
          Discover the key features that will help you get the most out of the
          platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="users" className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-medium">Team Management</h4>
          </div>
          <p className="text-sm text-gray-600">
            Invite team members, manage roles, and collaborate effectively.
          </p>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="settings" className="w-4 h-4 text-green-600" />
            </div>
            <h4 className="font-medium">Organization Settings</h4>
          </div>
          <p className="text-sm text-gray-600">
            Customize your workspace settings and preferences.
          </p>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Icon name="user" className="w-4 h-4 text-yellow-600" />
            </div>
            <h4 className="font-medium">User Profile</h4>
          </div>
          <p className="text-sm text-gray-600">
            Update your profile information and preferences.
          </p>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="help-circle" className="w-4 h-4 text-red-600" />
            </div>
            <h4 className="font-medium">Help & Support</h4>
          </div>
          <p className="text-sm text-gray-600">
            Access documentation and get help when you need it.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="info" className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Pro Tip</h4>
            <p className="text-sm text-blue-700">
              You can always access this tour later from the help menu in the
              top navigation.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          disabled={loading}
          className="flex-1"
        >
          Skip tour
        </Button>
        <Button
          onClick={() => onComplete()}
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Icon name="refresh-cw" className="w-4 h-4 mr-2 animate-spin" />
              Continuing...
            </>
          ) : (
            <>
              Continue
              <Icon name="arrow-right" className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
