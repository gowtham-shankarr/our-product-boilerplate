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

// Client-side CSRF token utility functions

export async function fetchCSRFToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/csrf");
    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
  }
  return null;
}

export async function fetchWithCSRF(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const csrfToken = await fetchCSRFToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
