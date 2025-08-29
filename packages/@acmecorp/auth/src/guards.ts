import type {
  User,
  Permission,
  UserRole,
  RouteGuardOptions,
  ApiGuardOptions,
} from "./types";
import { hasPermission, hasPermissions, hasRole } from "./permissions";

/**
 * Check if user has access to a route
 */
export function checkRouteAccess(
  user: User | null,
  options: RouteGuardOptions = {}
): { hasAccess: boolean; reason?: string; missingPermissions?: Permission[] } {
  const { requiredPermissions, requiredRole } = options;

  if (!user) {
    return { hasAccess: false, reason: "not_authenticated" };
  }

  // Check role requirement
  if (requiredRole && !hasRole(user, requiredRole)) {
    return { hasAccess: false, reason: "insufficient_role" };
  }

  // Check permission requirements
  if (requiredPermissions && requiredPermissions.length > 0) {
    const permissionCheck = hasPermissions(user, requiredPermissions);
    if (!permissionCheck.hasPermission) {
      return {
        hasAccess: false,
        reason: "insufficient_permissions",
        missingPermissions: permissionCheck.missingPermissions,
      };
    }
  }

  return { hasAccess: true };
}

/**
 * Higher-order function for API route protection
 */
export function withApiAuth(handler: Function, options: ApiGuardOptions = {}) {
  return async function ProtectedApiHandler(req: any, res: any) {
    const {
      requiredPermissions,
      requiredRole,
      allowUnauthenticated = false,
    } = options;

    // TODO: Replace with real auth integration
    // Example:
    // const session = await getServerSession(req, res, authOptions);
    // const user = session?.user as User | null;
    // const isAuthenticated = !!session;

    // For now, this is a placeholder that developers need to implement
    const user: User | null = null;
    const isAuthenticated = false;

    if (!isAuthenticated && !allowUnauthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!user && !allowUnauthenticated) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check role requirement
    if (user && requiredRole && !hasRole(user, requiredRole)) {
      return res.status(403).json({ error: "Insufficient role" });
    }

    // Check permission requirements
    if (user && requiredPermissions && requiredPermissions.length > 0) {
      const permissionCheck = hasPermissions(user, requiredPermissions);
      if (!permissionCheck.hasPermission) {
        return res.status(403).json({
          error: "Insufficient permissions",
          missingPermissions: permissionCheck.missingPermissions,
        });
      }
    }

    // Call the original handler
    return handler(req, res);
  };
}

/**
 * Higher-order function for server action protection
 */
export function withServerActionAuth(
  action: Function,
  options: ApiGuardOptions = {}
) {
  return async function ProtectedServerAction(...args: any[]) {
    const {
      requiredPermissions,
      requiredRole,
      allowUnauthenticated = false,
    } = options;

    // TODO: Replace with real auth integration
    // Example:
    // const session = await getServerSession(authOptions);
    // const user = session?.user as User | null;
    // const isAuthenticated = !!session;

    // For now, this is a placeholder that developers need to implement
    const user: User | null = null;
    const isAuthenticated = false;

    if (!isAuthenticated && !allowUnauthenticated) {
      throw new Error("Unauthorized");
    }

    if (!user && !allowUnauthenticated) {
      throw new Error("User not found");
    }

    // Check role requirement
    if (user && requiredRole && !hasRole(user, requiredRole)) {
      throw new Error("Insufficient role");
    }

    // Check permission requirements
    if (user && requiredPermissions && requiredPermissions.length > 0) {
      const permissionCheck = hasPermissions(user, requiredPermissions);
      if (!permissionCheck.hasPermission) {
        throw new Error("Insufficient permissions");
      }
    }

    // Call the original action
    return action(...args);
  };
}

/**
 * Check if user has a specific permission
 */
export function withPermission(
  user: User | null,
  permission: Permission
): boolean {
  if (!user) return false;
  return hasPermission(user, permission);
}

/**
 * Check if user has a specific role
 */
export function withRole(user: User | null, role: UserRole): boolean {
  if (!user) return false;
  return hasRole(user, role);
}

/**
 * Create auth middleware for Next.js
 */
export function createAuthMiddleware(options: RouteGuardOptions = {}) {
  return function authMiddleware(req: any, res: any, next: Function) {
    const { requiredPermissions, requiredRole } = options;

    // TODO: Replace with real auth integration
    // Example:
    // const session = await getServerSession(req, res, authOptions);
    // const user = session?.user as User | null;
    // const isAuthenticated = !!session;

    // For now, this is a placeholder that developers need to implement
    const user: User | null = null;
    const isAuthenticated = false;

    if (!isAuthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check role requirement
    if (requiredRole && !hasRole(user, requiredRole)) {
      return res.status(403).json({ error: "Insufficient role" });
    }

    // Check permission requirements
    if (requiredPermissions && requiredPermissions.length > 0) {
      const permissionCheck = hasPermissions(user, requiredPermissions);
      if (!permissionCheck.hasPermission) {
        return res.status(403).json({
          error: "Insufficient permissions",
          missingPermissions: permissionCheck.missingPermissions,
        });
      }
    }

    // Add user to request object
    (req as any).user = user;
    next();
  };
}

/**
 * Check if a route is protected
 */
export function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ["/dashboard", "/profile", "/admin", "/settings"];

  return protectedRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Get the appropriate redirect URL for auth
 */
export function getAuthRedirectUrl(
  currentPath: string,
  defaultRedirect: string = "/auth/signin"
): string {
  if (isProtectedRoute(currentPath)) {
    return `${defaultRedirect}?callbackUrl=${encodeURIComponent(currentPath)}`;
  }
  return defaultRedirect;
}
