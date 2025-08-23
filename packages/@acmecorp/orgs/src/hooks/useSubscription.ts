import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "../services";
import type { SubscriptionFilters, PaginationParams } from "../types";
import type {
  CreateSubscriptionForm,
  UpdateSubscriptionForm,
} from "../schemas";

// Query keys
export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  details: () => [...subscriptionKeys.all, "detail"] as const,
  detail: (organizationId: string) =>
    [...subscriptionKeys.details(), organizationId] as const,
  invoices: (organizationId: string) =>
    [...subscriptionKeys.detail(organizationId), "invoices"] as const,
  invoice: (organizationId: string, invoiceId: string) =>
    [...subscriptionKeys.invoices(organizationId), invoiceId] as const,
  usage: (organizationId: string) =>
    [...subscriptionKeys.detail(organizationId), "usage"] as const,
  stats: (organizationId: string) =>
    [...subscriptionKeys.detail(organizationId), "stats"] as const,
  limits: (organizationId: string) =>
    [...subscriptionKeys.detail(organizationId), "limits"] as const,
};

/**
 * Hook to get subscription for organization
 */
export function useSubscription(organizationId: string) {
  return useQuery({
    queryKey: subscriptionKeys.detail(organizationId),
    queryFn: () => subscriptionService.get(organizationId),
    enabled: !!organizationId,
  });
}

/**
 * Hook to get subscription usage
 */
export function useSubscriptionUsage(organizationId: string) {
  return useQuery({
    queryKey: subscriptionKeys.usage(organizationId),
    queryFn: () => subscriptionService.getUsage(organizationId),
    enabled: !!organizationId,
  });
}

/**
 * Hook to get subscription statistics
 */
export function useSubscriptionStats(organizationId: string) {
  return useQuery({
    queryKey: subscriptionKeys.stats(organizationId),
    queryFn: () => subscriptionService.getStats(organizationId),
    enabled: !!organizationId,
  });
}

/**
 * Hook to get subscription plan limits
 */
export function useSubscriptionLimits(organizationId: string) {
  return useQuery({
    queryKey: subscriptionKeys.limits(organizationId),
    queryFn: () => subscriptionService.getPlanLimits(organizationId),
    enabled: !!organizationId,
  });
}

/**
 * Hook to list invoices
 */
export function useInvoices(
  organizationId: string,
  pagination: PaginationParams = {}
) {
  return useQuery({
    queryKey: subscriptionKeys.invoices(organizationId),
    queryFn: () => subscriptionService.listInvoices(organizationId, pagination),
    enabled: !!organizationId,
  });
}

/**
 * Hook to get invoice by ID
 */
export function useInvoice(organizationId: string, invoiceId: string) {
  return useQuery({
    queryKey: subscriptionKeys.invoice(organizationId, invoiceId),
    queryFn: () => subscriptionService.getInvoice(organizationId, invoiceId),
    enabled: !!organizationId && !!invoiceId,
  });
}

/**
 * Hook to create subscription
 */
export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: {
      organizationId: string;
      data: CreateSubscriptionForm;
    }) => subscriptionService.create(organizationId, data),
    onSuccess: (data) => {
      // Invalidate subscription for this organization
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(data.organizationId),
      });
    },
  });
}

/**
 * Hook to update subscription
 */
export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: {
      organizationId: string;
      data: UpdateSubscriptionForm;
    }) => subscriptionService.update(organizationId, data),
    onSuccess: (data) => {
      // Invalidate subscription for this organization
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(data.organizationId),
      });
    },
  });
}

/**
 * Hook to cancel subscription
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      cancelAtPeriodEnd,
    }: {
      organizationId: string;
      cancelAtPeriodEnd?: boolean;
    }) => subscriptionService.cancel(organizationId, cancelAtPeriodEnd),
    onSuccess: (data) => {
      // Invalidate subscription for this organization
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(data.organizationId),
      });
    },
  });
}

/**
 * Hook to reactivate subscription
 */
export function useReactivateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: string) =>
      subscriptionService.reactivate(organizationId),
    onSuccess: (data) => {
      // Invalidate subscription for this organization
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(data.organizationId),
      });
    },
  });
}

/**
 * Hook to check if subscription is active
 */
export function useIsSubscriptionActive(organizationId: string) {
  return useQuery({
    queryKey: ["subscriptions", "is-active", organizationId],
    queryFn: () => subscriptionService.isActive(organizationId),
    enabled: !!organizationId,
  });
}

/**
 * Hook to check if subscription is in trial
 */
export function useIsSubscriptionInTrial(organizationId: string) {
  return useQuery({
    queryKey: ["subscriptions", "is-trial", organizationId],
    queryFn: () => subscriptionService.isInTrial(organizationId),
    enabled: !!organizationId,
  });
}
