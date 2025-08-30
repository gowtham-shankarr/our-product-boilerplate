import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const db =
  globalThis.__prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = db;
}

// Re-export Prisma types
export type {
  PrismaClient,
  User,
  Organization,
  Membership,
  Account,
  Session,
  VerificationToken,
  PasswordReset,
  EmailVerification,
  OnboardingStep,
  OnboardingProgress,
  UserPreferences,
} from "@prisma/client";
