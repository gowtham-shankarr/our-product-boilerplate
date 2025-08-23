// Re-export all environment utilities
export * from "./server.js";
export * from "./client.js";

// Convenience function to validate all environment variables
import { validateServerEnv } from "./server.js";
import { validateClientEnv } from "./client.js";
import type { ServerEnv } from "./server.js";
import type { ClientEnv } from "./client.js";

export function validateEnv(env: Record<string, string | undefined>): {
  server: ServerEnv;
  client: ClientEnv;
} {
  return {
    server: validateServerEnv(env),
    client: validateClientEnv(env),
  };
}
