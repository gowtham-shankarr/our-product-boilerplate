"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useOnboarding() {
  const { data: session } = useSession();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      checkOnboardingStatus();
    }
  }, [session?.user?.id]);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch("/api/onboarding/progress");
      const data = await response.json();

      if (data.success) {
        setOnboardingCompleted(data.isCompleted);
        // Show onboarding if not completed
        if (!data.isCompleted) {
          setShowOnboarding(true);
        }
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setLoading(false);
    }
  };

  const openOnboarding = () => {
    setShowOnboarding(true);
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setOnboardingCompleted(true);
  };

  return {
    showOnboarding,
    onboardingCompleted,
    loading,
    openOnboarding,
    closeOnboarding,
    completeOnboarding,
  };
}
