import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type {
  User,
  Permission,
  UserRole,
  RouteGuardOptions,
  ApiGuardOptions,
} from "./types";
import { hasPermission, hasPermissions, hasRole } from "./permissions";

/**
 * Route protection for Next.js pages
 */
export function withAuth(
  handler: (
    req: NextRequest,
    user: User
  ) => Promise<NextResponse> | NextResponse,
  options: RouteGuardOptions = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Get user from session (this would be implemented with NextAuth)
      const user = await getCurrentUser(req);

      if (!user && options.requireAuth !== false) {
        const redirectUrl = options.redirectTo || "/auth/login";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }

      // Check role requirements
      if (
        options.requiredRole &&
        user &&
        !hasRole(user, options.requiredRole)
      ) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // Check permission requirements
      if (options.requiredPermissions && user) {
        const permissionCheck = hasPermissions(
          user,
          options.requiredPermissions
        );
        if (!permissionCheck.hasPermission) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }

      return handler(req, user!);
    } catch (error) {
      console.error("Auth guard error:", error);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  };
}

/**
 * API route protection
 */
export function withApiAuth(
  handler: (
    req: NextRequest,
    user: User
  ) => Promise<NextResponse> | NextResponse,
  options: ApiGuardOptions = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Get user from session
      const user = await getCurrentUser(req);

      if (!user && options.requireAuth !== false) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Check role requirements
      if (
        options.requiredRole &&
        user &&
        !hasRole(user, options.requiredRole)
      ) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }

      // Check permission requirements
      if (options.requiredPermissions && user) {
        const permissionCheck = hasPermissions(
          user,
          options.requiredPermissions
        );
        if (!permissionCheck.hasPermission) {
          return NextResponse.json(
            {
              error: "Insufficient permissions",
              missingPermissions: permissionCheck.missingPermissions,
            },
            { status: 403 }
          );
        }
      }

      return handler(req, user!);
    } catch (error) {
      console.error("API auth guard error:", error);
      if (options.onUnauthorized) {
        options.onUnauthorized(error as Error);
      }
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
}

/**
 * Server Action protection
 */
export function withServerActionAuth(
  action: (formData: FormData, user: User) => Promise<any>,
  options: ApiGuardOptions = {}
) {
  return async (formData: FormData): Promise<any> => {
    try {
      // Get user from session (server-side)
      const user = await getServerSession();

      if (!user && options.requireAuth !== false) {
        throw new Error("Unauthorized");
      }

      // Check role requirements
      if (
        options.requiredRole &&
        user &&
        !hasRole(user, options.requiredRole)
      ) {
        throw new Error("Insufficient permissions");
      }

      // Check permission requirements
      if (options.requiredPermissions && user) {
        const permissionCheck = hasPermissions(
          user,
          options.requiredPermissions
        );
        if (!permissionCheck.hasPermission) {
          throw new Error("Insufficient permissions");
        }
      }

      return action(formData, user!);
    } catch (error) {
      console.error("Server action auth error:", error);
      throw error;
    }
  };
}

/**
 * Permission-based component guard
 */
export function withPermission(
  Component: any,
  requiredPermissions: Permission[],
  fallback?: any
) {
  return function PermissionGuard(props: any) {
    // This would be used with useAuth hook in client components
    // For now, return the component - the actual check would be done in the component
    return Component(props);
  };
}

/**
 * Role-based component guard
 */
export function withRole(
  Component: any,
  requiredRole: UserRole,
  fallback?: any
) {
  return function RoleGuard(props: any) {
    // This would be used with useAuth hook in client components
    // For now, return the component - the actual check would be done in the component
    return Component(props);
  };
}

/**
 * Create a middleware for route protection
 */
export function createAuthMiddleware(options: RouteGuardOptions = {}) {
  return function authMiddleware(req: NextRequest): NextResponse | null {
    // This would be used in Next.js middleware
    // For now, return null to allow the request to continue
    return null;
  };
}

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(
  pathname: string,
  protectedRoutes: string[] = []
): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Get redirect URL based on auth state
 */
export function getAuthRedirectUrl(
  isAuthenticated: boolean,
  pathname: string,
  loginPage: string = "/auth/login",
  dashboardPage: string = "/dashboard"
): string | null {
  if (!isAuthenticated && pathname !== loginPage) {
    return loginPage;
  }

  if (isAuthenticated && pathname === loginPage) {
    return dashboardPage;
  }

  return null;
}

// Placeholder functions - these would be implemented with NextAuth
async function getCurrentUser(req: NextRequest): Promise<User | null> {
  // This would use NextAuth's getToken or similar
  // For now, return null
  return null;
}

async function getServerSession(): Promise<User | null> {
  // This would use NextAuth's getServerSession
  // For now, return null
  return null;
}
