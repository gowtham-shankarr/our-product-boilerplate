import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { User, Permission, UserRole, AuthState } from "./types";
import {
  hasPermission,
  hasPermissions,
  hasRole,
  getUserPermissions,
} from "./permissions";

/**
 * Enhanced auth hook with permission checking
 * Note: This is a placeholder implementation. In actual usage, you would import React hooks and NextAuth
 */
export function useAuth(): AuthState & {
  signIn: (provider?: string, options?: any) => Promise<any>;
  signOut: (options?: any) => Promise<any>;
  hasPermission: (permission: Permission) => boolean;
  hasPermissions: (permissions: Permission[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  getUserPermissions: () => Permission[];
} {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user as User | null;
  const isLoading = status === ("loading" as any);
  const isAuthenticated = (status === ("authenticated" as any) &&
    !!user) as any;

  const authSignIn = useCallback(async (provider?: string, options?: any) => {
    return signIn(provider as any, {
      callbackUrl: options?.callbackUrl || "/dashboard",
      ...options,
    });
  }, []);

  const authSignOut = useCallback(async (options?: any) => {
    return signOut({
      callbackUrl: options?.callbackUrl || "/",
      ...options,
    });
  }, []);

  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      return hasPermission(user, permission);
    },
    [user]
  );

  const checkPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      const check = hasPermissions(user, permissions);
      return check.hasPermission;
    },
    [user]
  );

  const checkRole = useCallback(
    (role: UserRole): boolean => {
      return hasRole(user, role);
    },
    [user]
  );

  const getPermissions = useCallback((): Permission[] => {
    return getUserPermissions(user);
  }, [user]);

  return {
    user,
    session: session as any,
    isLoading,
    isAuthenticated,
    signIn: authSignIn,
    signOut: authSignOut,
    hasPermission: checkPermission,
    hasPermissions: checkPermissions,
    hasRole: checkRole,
    getUserPermissions: getPermissions,
  };
}

/**
 * Hook for permission-based rendering
 */
export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();
  return useMemo(() => hasPermission(user, permission), [user, permission]);
}

/**
 * Hook for multiple permissions checking
 */
export function usePermissions(permissions: Permission[]): {
  hasAll: boolean;
  hasAny: boolean;
  missing: Permission[];
} {
  const { user } = useAuth();

  return useMemo(() => {
    const check = hasPermissions(user, permissions);
    const hasAny = permissions.some((permission) =>
      hasPermission(user, permission)
    );

    return {
      hasAll: check.hasPermission,
      hasAny,
      missing: check.missingPermissions,
    };
  }, [user, permissions]);
}

/**
 * Hook for role-based rendering
 */
export function useRole(role: UserRole): boolean {
  const { user } = useAuth();
  return useMemo(() => hasRole(user, role), [user, role]);
}

/**
 * Hook for user permissions
 */
export function useUserPermissions(): Permission[] {
  const { user } = useAuth();
  return useMemo(() => getUserPermissions(user), [user]);
}

/**
 * Hook for auth-aware navigation
 */
export function useAuthNavigation() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const navigateToLogin = useCallback(
    (callbackUrl?: string) => {
      const url = callbackUrl
        ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : "/auth/login";
      router.push(url as any);
    },
    [router]
  );

  const navigateToDashboard = useCallback(() => {
    router.push("/dashboard" as any);
  }, [router]);

  const navigateToProfile = useCallback(() => {
    router.push("/profile" as any);
  }, [router]);

  const navigateToAdmin = useCallback(() => {
    if (user && hasRole(user, "admin")) {
      router.push("/admin" as any);
    }
  }, [user, router]);

  return {
    navigateToLogin,
    navigateToDashboard,
    navigateToProfile,
    navigateToAdmin,
  };
}

/**
 * Hook for auth state changes
 */
export function useAuthStateChange(callback: (authState: AuthState) => void) {
  const auth = useAuth();

  // This would use useEffect to watch for auth state changes
  // For now, just return the current state
  return auth;
}

/**
 * Hook for protected route access
 */
export function useProtectedRoute(
  requiredPermissions?: Permission[],
  requiredRole?: UserRole,
  redirectTo?: string
) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const hasAccess = useMemo(() => {
    if (!isAuthenticated) return false;
    if (!user) return false;

    if (requiredRole && !hasRole(user, requiredRole)) {
      return false;
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      const check = hasPermissions(user, requiredPermissions);
      return check.hasPermission;
    }

    return true;
  }, [user, isAuthenticated, requiredPermissions, requiredRole]);

  const redirect = useCallback(() => {
    if (!isLoading && !hasAccess) {
      const url = redirectTo || "/auth/login";
      router.push(url as any);
    }
  }, [hasAccess, isLoading, redirectTo, router]);

  return {
    hasAccess,
    isLoading,
    redirect,
    user,
  };
}

/**
 * Hook for auth forms
 */
export function useAuthForm() {
  const { signIn, signOut } = useAuth();
  const router = useRouter();

  const handleLogin = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        const result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/dashboard" as any);
          return { success: true };
        } else {
          return { success: false, error: result?.error || "Login failed" };
        }
      } catch (error) {
        return { success: false, error: "Login failed" };
      }
    },
    [signIn, router]
  );

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      router.push("/" as any);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Logout failed" };
    }
  }, [signOut, router]);

  return {
    handleLogin,
    handleLogout,
  };
}
