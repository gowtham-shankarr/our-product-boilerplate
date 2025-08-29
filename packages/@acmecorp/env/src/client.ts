import { z } from "zod";

const clientSchema = z.object({
  // App Configuration
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().optional().default("SaaS App"),

  // OAuth Providers (public keys)
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string().optional(),

  // Payments
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // File Upload
  NEXT_PUBLIC_UPLOADTHING_APP_ID: z.string().optional(),
});

export type ClientEnv = z.infer<typeof clientSchema>;

export function validateClientEnv(
  env: Record<string, string | undefined>
): ClientEnv {
  return clientSchema.parse(env);
}

export function getClientEnv(): ClientEnv {
  return validateClientEnv(process.env);
}
