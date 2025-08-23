import type { ApiError } from "./types";

/**
 * Query key builders for each domain
 */
export const queryKeys = {
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: any) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  orgs: {
    all: ["orgs"] as const,
    lists: () => [...queryKeys.orgs.all, "list"] as const,
    list: (filters: any) => [...queryKeys.orgs.lists(), filters] as const,
    details: () => [...queryKeys.orgs.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.orgs.details(), id] as const,
  },

  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    list: (filters: any) => [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },

  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },
};

/**
 * Retry policy that mirrors transport layer rules
 */
export function createRetryPolicy() {
  return (failureCount: number, error: any) => {
    // Don't retry on certain error codes
    if (
      error?.code === "UNAUTHORIZED" ||
      error?.code === "FORBIDDEN" ||
      error?.code === "VALIDATION_ERROR"
    ) {
      return false;
    }

    // Retry 5xx errors and network errors up to 3 times
    return failureCount < 3;
  };
}

/**
 * Invalidation helpers for React Query
 */
export function createInvalidationHelpers(queryClient: any) {
  return {
    // Invalidate all queries for a domain
    invalidate: {
      users: () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
      orgs: () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.orgs.all }),
      projects: () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
      auth: () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
    },

    // Invalidate list queries for a domain
    invalidateList: {
      users: (filters?: any) =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.list(filters),
        }),
      orgs: (filters?: any) =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.orgs.list(filters),
        }),
      projects: (filters?: any) =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.list(filters),
        }),
    },

    // Invalidate specific detail queries
    invalidateDetail: {
      users: (id: string) =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.detail(id),
        }),
      orgs: (id: string) =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.orgs.detail(id),
        }),
      projects: (id: string) =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.detail(id),
        }),
    },

    // Remove specific detail queries from cache
    removeDetail: {
      users: (id: string) =>
        queryClient.removeQueries({
          queryKey: queryKeys.users.detail(id),
        }),
      orgs: (id: string) =>
        queryClient.removeQueries({
          queryKey: queryKeys.orgs.detail(id),
        }),
      projects: (id: string) =>
        queryClient.removeQueries({
          queryKey: queryKeys.projects.detail(id),
        }),
    },
  };
}

/**
 * Optimistic update helpers
 */
export function createOptimisticHelpers(queryClient: any) {
  return {
    // Optimistically update a user
    updateUser: (id: string, updates: any) => {
      queryClient.setQueryData(queryKeys.users.detail(id), (old: any) => ({
        ...old,
        ...updates,
      }));
    },

    // Optimistically update an organization
    updateOrg: (id: string, updates: any) => {
      queryClient.setQueryData(queryKeys.orgs.detail(id), (old: any) => ({
        ...old,
        ...updates,
      }));
    },

    // Optimistically update a project
    updateProject: (id: string, updates: any) => {
      queryClient.setQueryData(queryKeys.projects.detail(id), (old: any) => ({
        ...old,
        ...updates,
      }));
    },

    // Optimistically add to a list
    addToList: (
      domain: "users" | "orgs" | "projects",
      filters: any,
      newItem: any
    ) => {
      queryClient.setQueryData(queryKeys[domain].list(filters), (old: any) => ({
        ...old,
        items: [newItem, ...(old?.items || [])],
      }));
    },

    // Optimistically remove from a list
    removeFromList: (
      domain: "users" | "orgs" | "projects",
      filters: any,
      id: string
    ) => {
      queryClient.setQueryData(queryKeys[domain].list(filters), (old: any) => ({
        ...old,
        items: (old?.items || []).filter((item: any) => item.id !== id),
      }));
    },
  };
}

/**
 * Error handling utilities
 */
export function createErrorHandlers() {
  return {
    // Check if error is a specific type
    isError: {
      unauthorized: (error: any) => error?.code === "UNAUTHORIZED",
      forbidden: (error: any) => error?.code === "FORBIDDEN",
      notFound: (error: any) => error?.code === "NOT_FOUND",
      validation: (error: any) => error?.code === "VALIDATION_ERROR",
      rateLimited: (error: any) => error?.code === "RATE_LIMITED",
      conflict: (error: any) => error?.code === "CONFLICT",
    },

    // Get field errors from validation error
    getFieldErrors: (error: any): Array<{ field: string; message: string }> => {
      if (error?.code === "VALIDATION_ERROR" && Array.isArray(error.details)) {
        return error.details.map((detail: any) => ({
          field: detail.field,
          message: detail.message,
        }));
      }
      return [];
    },

    // Get user-friendly error message
    getErrorMessage: (error: any): string => {
      if (error?.message) {
        return error.message;
      }

      if (error?.code) {
        switch (error.code) {
          case "UNAUTHORIZED":
            return "Please log in to continue";
          case "FORBIDDEN":
            return "You do not have permission to perform this action";
          case "NOT_FOUND":
            return "The requested resource was not found";
          case "VALIDATION_ERROR":
            return "Please check your input and try again";
          case "RATE_LIMITED":
            return "Too many requests. Please try again later";
          case "CONFLICT":
            return "This resource already exists";
          default:
            return "An unexpected error occurred";
        }
      }

      return "An unexpected error occurred";
    },
  };
}

/**
 * Query configuration presets
 */
export const queryConfig = {
  // Default query options
  default: {
    retry: createRetryPolicy(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  },

  // List queries
  list: {
    retry: createRetryPolicy(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  },

  // Detail queries
  detail: {
    retry: createRetryPolicy(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },

  // Auth queries
  auth: {
    retry: false, // Don't retry auth failures
    staleTime: 0, // Always fresh
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
};

/**
 * Mutation configuration presets
 */
export const mutationConfig = {
  // Default mutation options
  default: {
    retry: false, // Don't retry mutations by default
  },

  // Create mutations
  create: {
    retry: false,
    onSuccess: (queryClient: any, domain: string) => {
      // Invalidate lists after creating
      queryClient.invalidateQueries({
        queryKey: queryKeys[domain as keyof typeof queryKeys]?.all,
      });
    },
  },

  // Update mutations
  update: {
    retry: false,
    onSuccess: (queryClient: any, domain: string, id: string) => {
      // Invalidate specific detail and lists (only for CRUD domains)
      if (domain !== "auth") {
        const domainKeys = queryKeys[domain as keyof typeof queryKeys] as any;
        if (domainKeys?.detail) {
          queryClient.invalidateQueries({ queryKey: domainKeys.detail(id) });
        }
        if (domainKeys?.lists) {
          queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
        }
      }
    },
  },

  // Delete mutations
  delete: {
    retry: false,
    onSuccess: (queryClient: any, domain: string, id: string) => {
      // Remove detail and invalidate lists (only for CRUD domains)
      if (domain !== "auth") {
        const domainKeys = queryKeys[domain as keyof typeof queryKeys] as any;
        if (domainKeys?.detail) {
          queryClient.removeQueries({ queryKey: domainKeys.detail(id) });
        }
        if (domainKeys?.lists) {
          queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
        }
      }
    },
  },
};
