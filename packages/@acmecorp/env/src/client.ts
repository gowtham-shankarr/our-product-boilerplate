import { z } from "zod";

const clientSchema = z.object({
  // Public keys only
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_UPLOADTHING_APP_ID: z.string().optional(),
});

export type ClientEnv = z.infer<typeof clientSchema>;

export function validateClientEnv(env: Record<string, string | undefined>): ClientEnv {
  return clientSchema.parse(env);
}

export function getClientEnv(): ClientEnv {
  return validateClientEnv(process.env);
}
