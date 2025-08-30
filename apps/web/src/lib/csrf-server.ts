import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { validateCSRFToken } from "./csrf";

// Middleware-friendly CSRF validation for API routes
export async function validateCSRFForAPI(request: Request): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return false;
    }

    const csrfToken = request.headers.get("x-csrf-token");
    if (!csrfToken) {
      return false;
    }

    return validateCSRFToken(session.user.id, csrfToken);
  } catch (error) {
    console.error("CSRF validation error:", error);
    return false;
  }
}

// Higher-order function to wrap API handlers with CSRF protection
export function withCSRF<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    // Skip CSRF validation for GET and HEAD requests
    if (request.method === "GET" || request.method === "HEAD") {
      return handler(request, ...args);
    }

    // Validate CSRF token for state-changing requests
    const isValidCSRF = await validateCSRFForAPI(request);
    if (!isValidCSRF) {
      return NextResponse.json(
        { error: "CSRF token required" },
        { status: 403 }
      );
    }

    return handler(request, ...args);
  };
}
