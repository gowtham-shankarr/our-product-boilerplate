import { randomBytes } from "crypto";

// In-memory CSRF token store (use Redis in production)
const csrfTokens = new Map<string, { token: string; expires: number }>();

export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex");
}

export function createCSRFToken(sessionId: string): string {
  const token = generateCSRFToken();
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  csrfTokens.set(sessionId, { token, expires });

  // Clean up expired tokens
  for (const [key, value] of csrfTokens.entries()) {
    if (value.expires < Date.now()) {
      csrfTokens.delete(key);
    }
  }

  return token;
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);

  if (!stored || stored.expires < Date.now()) {
    csrfTokens.delete(sessionId);
    return false;
  }

  if (stored.token !== token) {
    return false;
  }

  // Remove token after successful validation (one-time use)
  csrfTokens.delete(sessionId);
  return true;
}

export function getCSRFToken(sessionId: string): string | null {
  const stored = csrfTokens.get(sessionId);

  if (!stored || stored.expires < Date.now()) {
    csrfTokens.delete(sessionId);
    return null;
  }

  return stored.token;
}
