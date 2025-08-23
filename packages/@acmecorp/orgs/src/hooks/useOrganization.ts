import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "../services";
import type {
  CreateOrganizationForm,
  UpdateOrganizationForm,
  OrganizationFilters,
  PaginationParams,
} from "../types";

// Query keys
export const organizationKeys = {
  all: ["organizations"] as const,
  lists: () => [...organizationKeys.all, "list"] as const,
  list: (filters: OrganizationFilters, pagination: PaginationParams) =>
    [...organizationKeys.lists(), { filters, pagination }] as const,
  details: () => [...organizationKeys.all, "detail"] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
  bySlug: (slug: string) =>
    [...organizationKeys.details(), "slug", slug] as const,
  bySubdomain: (subdomain: string) =>
    [...organizationKeys.details(), "subdomain", subdomain] as const,
  settings: (id: string) =>
    [...organizationKeys.details(), id, "settings"] as const,
  stats: (id: string) => [...organizationKeys.details(), id, "stats"] as const,
};

/**
 * Hook to get organization by ID
 */
export function useOrganization(id: string) {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => organizationService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to get organization by slug
 */
export function useOrganizationBySlug(slug: string) {
  return useQuery({
    queryKey: organizationKeys.bySlug(slug),
    queryFn: () => organizationService.getBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Hook to get organization by subdomain
 */
export function useOrganizationBySubdomain(subdomain: string) {
  return useQuery({
    queryKey: organizationKeys.bySubdomain(subdomain),
    queryFn: () => organizationService.getBySubdomain(subdomain),
    enabled: !!subdomain,
  });
}

/**
 * Hook to list organizations
 */
export function useOrganizations(
  filters: OrganizationFilters = {},
  pagination: PaginationParams = {}
) {
  return useQuery({
    queryKey: organizationKeys.list(filters, pagination),
    queryFn: () => organizationService.list(filters, pagination),
  });
}

/**
 * Hook to get organization settings
 */
export function useOrganizationSettings(id: string) {
  return useQuery({
    queryKey: organizationKeys.settings(id),
    queryFn: () => Promise.resolve(null), // TODO: Implement settings service
    enabled: !!id,
  });
}

/**
 * Hook to get organization statistics
 */
export function useOrganizationStats(id: string) {
  return useQuery({
    queryKey: organizationKeys.stats(id),
    queryFn: () => organizationService.getStats(id),
    enabled: !!id,
  });
}

/**
 * Hook to create organization
 */
export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationForm) =>
      organizationService.create(data),
    onSuccess: () => {
      // Invalidate organization lists
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}

/**
 * Hook to update organization
 */
export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrganizationForm }) =>
      organizationService.update(id, data),
    onSuccess: (data) => {
      // Invalidate specific organization
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(data.id),
      });
      // Invalidate organization lists
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}

/**
 * Hook to delete organization
 */
export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationService.delete(id),
    onSuccess: () => {
      // Invalidate organization lists
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}

/**
 * Hook to check if organization slug is available
 */
export function useCheckSlugAvailability(slug: string) {
  return useQuery({
    queryKey: ["organizations", "slug-availability", slug],
    queryFn: () => organizationService.isSlugAvailable(slug),
    enabled: !!slug,
  });
}

/**
 * Hook to check if organization subdomain is available
 */
export function useCheckSubdomainAvailability(subdomain: string) {
  return useQuery({
    queryKey: ["organizations", "subdomain-availability", subdomain],
    queryFn: () => organizationService.isSubdomainAvailable(subdomain),
    enabled: !!subdomain,
  });
}
