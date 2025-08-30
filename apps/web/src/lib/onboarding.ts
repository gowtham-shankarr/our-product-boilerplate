import { db } from "@acmecorp/db";

export interface OnboardingStepData {
  key: string;
  title: string;
  description?: string;
  order: number;
  required: boolean;
  isActive: boolean;
}

export interface OnboardingProgressData {
  stepId: string;
  completed: boolean;
  skipped: boolean;
  data?: any;
}

// Default onboarding steps
export const DEFAULT_ONBOARDING_STEPS: OnboardingStepData[] = [
  {
    key: "welcome",
    title: "Welcome to Your SaaS Platform",
    description: "Let's get you started with a quick setup",
    order: 1,
    required: true,
    isActive: true,
  },
  {
    key: "organization",
    title: "Set Up Your Organization",
    description: "Tell us about your organization",
    order: 2,
    required: true,
    isActive: true,
  },
  {
    key: "profile",
    title: "Complete Your Profile",
    description: "Add your profile information",
    order: 3,
    required: false,
    isActive: true,
  },
  {
    key: "tour",
    title: "Take a Quick Tour",
    description: "Learn about key features",
    order: 4,
    required: false,
    isActive: true,
  },
  {
    key: "invite",
    title: "Invite Your Team",
    description: "Get your team onboard",
    order: 5,
    required: false,
    isActive: true,
  },
];

export class OnboardingService {
  // Initialize onboarding steps for a new user
  static async initializeUserOnboarding(userId: string) {
    try {
      // Create user preferences if they don't exist
      await db.userPreferences.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          onboardingCompleted: false,
        },
      });

      // Get or create onboarding steps
      for (const stepData of DEFAULT_ONBOARDING_STEPS) {
        const step = await db.onboardingStep.upsert({
          where: { key: stepData.key },
          update: stepData,
          create: stepData,
        });

        // Create progress record for this user and step
        await db.onboardingProgress.upsert({
          where: {
            userId_stepId: {
              userId,
              stepId: step.id,
            },
          },
          update: {},
          create: {
            userId,
            stepId: step.id,
            completed: false,
            skipped: false,
          },
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error initializing onboarding:", error);
      return { success: false, error: "Failed to initialize onboarding" };
    }
  }

  // Get user's onboarding progress
  static async getUserOnboardingProgress(userId: string) {
    try {
      // Check if user has preferences, if not initialize onboarding
      let preferences = await db.userPreferences.findUnique({
        where: { userId },
      });

      if (!preferences) {
        // Initialize onboarding for new user
        await this.initializeUserOnboarding(userId);
        preferences = await db.userPreferences.findUnique({
          where: { userId },
        });
      }

      const progress = await db.onboardingProgress.findMany({
        where: { userId },
        include: {
          step: true,
        },
        orderBy: {
          step: {
            order: "asc",
          },
        },
      });

      return {
        success: true,
        progress,
        preferences,
        totalSteps: progress.length,
        completedSteps: progress.filter((p: any) => p.completed).length,
        skippedSteps: progress.filter((p: any) => p.skipped).length,
        isCompleted: preferences?.onboardingCompleted || false,
      };
    } catch (error) {
      console.error("Error getting onboarding progress:", error);
      // Return a default response if database is not ready
      return {
        success: true,
        progress: [],
        preferences: null,
        totalSteps: 0,
        completedSteps: 0,
        skippedSteps: 0,
        isCompleted: false,
      };
    }
  }

  // Mark a step as completed
  static async completeStep(userId: string, stepKey: string, data?: any) {
    try {
      const step = await db.onboardingStep.findUnique({
        where: { key: stepKey },
      });

      if (!step) {
        return { success: false, error: "Step not found" };
      }

      await db.onboardingProgress.update({
        where: {
          userId_stepId: {
            userId,
            stepId: step.id,
          },
        },
        data: {
          completed: true,
          skipped: false,
          data: data || {},
          completedAt: new Date(),
        },
      });

      // Check if all required steps are completed
      await this.checkOnboardingCompletion(userId);

      return { success: true };
    } catch (error) {
      console.error("Error completing step:", error);
      return { success: false, error: "Failed to complete step" };
    }
  }

  // Mark a step as skipped
  static async skipStep(userId: string, stepKey: string) {
    try {
      const step = await db.onboardingStep.findUnique({
        where: { key: stepKey },
      });

      if (!step) {
        return { success: false, error: "Step not found" };
      }

      if (step.required) {
        return { success: false, error: "Cannot skip required step" };
      }

      await db.onboardingProgress.update({
        where: {
          userId_stepId: {
            userId,
            stepId: step.id,
          },
        },
        data: {
          skipped: true,
          completed: false,
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Error skipping step:", error);
      return { success: false, error: "Failed to skip step" };
    }
  }

  // Check if onboarding is completed
  static async checkOnboardingCompletion(userId: string) {
    try {
      const progress = await db.onboardingProgress.findMany({
        where: { userId },
        include: {
          step: true,
        },
      });

      const requiredSteps = progress.filter((p: any) => p.step.required);
      const completedRequiredSteps = requiredSteps.filter(
        (p: any) => p.completed
      );

      const isCompleted =
        completedRequiredSteps.length === requiredSteps.length;

      if (isCompleted) {
        await db.userPreferences.update({
          where: { userId },
          data: {
            onboardingCompleted: true,
            onboardingCompletedAt: new Date(),
          },
        });
      }

      return { success: true, isCompleted };
    } catch (error) {
      console.error("Error checking onboarding completion:", error);
      return { success: false, error: "Failed to check completion" };
    }
  }

  // Reset onboarding for a user
  static async resetOnboarding(userId: string) {
    try {
      await db.onboardingProgress.updateMany({
        where: { userId },
        data: {
          completed: false,
          skipped: false,
          data: {},
          completedAt: null,
        },
      });

      await db.userPreferences.update({
        where: { userId },
        data: {
          onboardingCompleted: false,
          onboardingCompletedAt: null,
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Error resetting onboarding:", error);
      return { success: false, error: "Failed to reset onboarding" };
    }
  }

  // Get onboarding analytics
  static async getOnboardingAnalytics() {
    try {
      const totalUsers = await db.user.count();
      const completedUsers = await db.userPreferences.count({
        where: { onboardingCompleted: true },
      });

      const stepProgress = await db.onboardingProgress.groupBy({
        by: ["stepId"],
        _count: {
          completed: true,
          skipped: true,
        },
      });

      return {
        success: true,
        analytics: {
          totalUsers,
          completedUsers,
          completionRate:
            totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0,
          stepProgress,
        },
      };
    } catch (error) {
      console.error("Error getting onboarding analytics:", error);
      return { success: false, error: "Failed to get analytics" };
    }
  }
}
