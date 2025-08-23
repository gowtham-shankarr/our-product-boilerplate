import { z } from "zod";

const serverSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Authentication
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),

  // OAuth Providers (placeholders)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Email (placeholders)
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.string().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Payments (placeholders)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // External APIs (placeholders)
  RESEND_API_KEY: z.string().optional(),
  UPLOADTHING_SECRET: z.string().optional(),
  UPLOADTHING_APP_ID: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

export function validateServerEnv(
  env: Record<string, string | undefined>
): ServerEnv {
  return serverSchema.parse(env);
}

export function getServerEnv(): ServerEnv {
  return validateServerEnv(process.env);
}
