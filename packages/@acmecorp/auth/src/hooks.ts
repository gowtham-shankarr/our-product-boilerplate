import { useState, useEffect, useCallback } from "react";
import type { User, Permission, UserRole, AuthState } from "./types";
import {
  hasPermission,
  hasPermissions,
  hasRole,
  getUserPermissions,
} from "./permissions";

/**
 * Hook to get current auth state
 * This integrates with NextAuth.js for real authentication
 */
export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // In a real app, this would integrate with NextAuth
  // For now, we'll provide a placeholder that developers can replace
  useEffect(() => {
    // TODO: Replace with real NextAuth integration
    // Example:
    // import { useSession } from "next-auth/react";
    // const { data: session, status } = useSession();
    //
    // setAuthState({
    //   user: session?.user as User | null,
    //   session: session as Session | null,
    //   isLoading: status === "loading",
    //   isAuthenticated: status === "authenticated",
    // });

    // Placeholder implementation
    setAuthState({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  return authState;
}

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();

  if (!user) return false;

  return hasPermission(user, permission);
}

/**
 * Hook to check if user has multiple permissions
 */
export function usePermissions(permissions: Permission[]) {
  const { user } = useAuth();

  if (!user) {
    return {
      hasPermission: false,
      missingPermissions: permissions,
      userPermissions: [],
    };
  }

  return hasPermissions(user, permissions);
}

/**
 * Hook to check if user has a specific role
 */
export function useRole(role: UserRole): boolean {
  const { user } = useAuth();

  if (!user) return false;

  return hasRole(user, role);
}

/**
 * Hook to get all user permissions
 */
export function useUserPermissions(): Permission[] {
  const { user } = useAuth();

  if (!user) return [];

  return getUserPermissions(user);
}

/**
 * Hook for auth navigation
 */
export function useAuthNavigation() {
  const { isAuthenticated, isLoading } = useAuth();

  const redirectToLogin = useCallback(() => {
    if (!isLoading && !isAuthenticated) {
      // TODO: Replace with NextAuth signIn or router.push
      // Example: signIn() or router.push('/auth/signin')
      console.log("Redirecting to login...");
    }
  }, [isAuthenticated, isLoading]);

  const redirectToDashboard = useCallback(() => {
    if (!isLoading && isAuthenticated) {
      // TODO: Replace with router.push
      // Example: router.push('/dashboard')
      console.log("Redirecting to dashboard...");
    }
  }, [isAuthenticated, isLoading]);

  return {
    redirectToLogin,
    redirectToDashboard,
  };
}

/**
 * Hook for auth state changes
 */
export function useAuthStateChange() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User authenticated:", user.email);
    } else if (!isAuthenticated) {
      console.log("User not authenticated");
    }
  }, [user, isAuthenticated]);

  return { user, isAuthenticated };
}

/**
 * Hook for protected routes
 */
export function useProtectedRoute(
  requiredPermissions?: Permission[],
  requiredRole?: UserRole
) {
  const { user, isAuthenticated, isLoading } = useAuth();

  const hasAccess = useCallback(() => {
    if (isLoading) return { hasAccess: false, loading: true };
    if (!isAuthenticated || !user) return { hasAccess: false, loading: false };

    // Check role first
    if (requiredRole && !hasRole(user, requiredRole)) {
      return { hasAccess: false, loading: false, reason: "insufficient_role" };
    }

    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const permissionCheck = hasPermissions(user, requiredPermissions);
      if (!permissionCheck.hasPermission) {
        return {
          hasAccess: false,
          loading: false,
          reason: "insufficient_permissions",
          missingPermissions: permissionCheck.missingPermissions,
        };
      }
    }

    return { hasAccess: true, loading: false };
  }, [user, isAuthenticated, isLoading, requiredPermissions, requiredRole]);

  return hasAccess();
}

/**
 * Hook for auth forms
 */
export function useAuthForm<T extends Record<string, any>>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  return {
    data,
    errors,
    isSubmitting,
    updateField,
    setFieldError,
    clearErrors,
    setIsSubmitting,
    reset,
  };
}
