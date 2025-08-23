import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "../services";
import type {
  InviteMemberForm,
  MemberFilters,
  PaginationParams,
} from "../types";
import type { UpdateMemberForm } from "../schemas";

// Query keys
export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  list: (
    organizationId: string,
    filters: MemberFilters,
    pagination: PaginationParams
  ) =>
    [...memberKeys.lists(), organizationId, { filters, pagination }] as const,
  details: () => [...memberKeys.all, "detail"] as const,
  detail: (organizationId: string, memberId: string) =>
    [...memberKeys.details(), organizationId, memberId] as const,
  stats: (organizationId: string) =>
    [...memberKeys.all, organizationId, "stats"] as const,
};

/**
 * Hook to get member by ID
 */
export function useMember(organizationId: string, memberId: string) {
  return useQuery({
    queryKey: memberKeys.detail(organizationId, memberId),
    queryFn: () => memberService.getById(organizationId, memberId),
    enabled: !!organizationId && !!memberId,
  });
}

/**
 * Hook to list organization members
 */
export function useMembers(
  organizationId: string,
  filters: MemberFilters = {},
  pagination: PaginationParams = {}
) {
  return useQuery({
    queryKey: memberKeys.list(organizationId, filters, pagination),
    queryFn: () => memberService.list(organizationId, filters, pagination),
    enabled: !!organizationId,
  });
}

/**
 * Hook to get member statistics
 */
export function useMemberStats(organizationId: string) {
  return useQuery({
    queryKey: memberKeys.stats(organizationId),
    queryFn: () => memberService.getStats(organizationId),
    enabled: !!organizationId,
  });
}

/**
 * Hook to invite member
 */
export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: {
      organizationId: string;
      data: InviteMemberForm;
    }) => memberService.invite(organizationId, data),
    onSuccess: (_, { organizationId }) => {
      // Invalidate member lists for this organization
      queryClient.invalidateQueries({
        queryKey: memberKeys.lists(),
        predicate: (query) => query.queryKey.includes(organizationId),
      });
    },
  });
}

/**
 * Hook to update member
 */
export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      memberId,
      data,
    }: {
      organizationId: string;
      memberId: string;
      data: UpdateMemberForm;
    }) => memberService.update(organizationId, memberId, data),
    onSuccess: (data, { organizationId }) => {
      // Invalidate specific member
      queryClient.invalidateQueries({
        queryKey: memberKeys.detail(organizationId, data.id),
      });
      // Invalidate member lists for this organization
      queryClient.invalidateQueries({
        queryKey: memberKeys.lists(),
        predicate: (query) => query.queryKey.includes(organizationId),
      });
    },
  });
}

/**
 * Hook to remove member
 */
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      memberId,
    }: {
      organizationId: string;
      memberId: string;
    }) => memberService.remove(organizationId, memberId),
    onSuccess: (_, { organizationId }) => {
      // Invalidate member lists for this organization
      queryClient.invalidateQueries({
        queryKey: memberKeys.lists(),
        predicate: (query) => query.queryKey.includes(organizationId),
      });
    },
  });
}

/**
 * Hook to accept invitation
 */
export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => memberService.acceptInvitation(token),
    onSuccess: (data) => {
      // Invalidate member lists for this organization
      queryClient.invalidateQueries({
        queryKey: memberKeys.lists(),
        predicate: (query) => query.queryKey.includes(data.organizationId),
      });
    },
  });
}

/**
 * Hook to decline invitation
 */
export function useDeclineInvitation() {
  return useMutation({
    mutationFn: (token: string) => memberService.declineInvitation(token),
  });
}

/**
 * Hook to resend invitation
 */
export function useResendInvitation() {
  return useMutation({
    mutationFn: ({
      organizationId,
      invitationId,
    }: {
      organizationId: string;
      invitationId: string;
    }) => memberService.resendInvitation(organizationId, invitationId),
  });
}

/**
 * Hook to check if user is member of organization
 */
export function useIsMember(organizationId: string, userId: string) {
  return useQuery({
    queryKey: ["members", "is-member", organizationId, userId],
    queryFn: () => memberService.isMember(organizationId, userId),
    enabled: !!organizationId && !!userId,
  });
}

/**
 * Hook to get member role in organization
 */
export function useMemberRole(organizationId: string, userId: string) {
  return useQuery({
    queryKey: ["members", "role", organizationId, userId],
    queryFn: () => memberService.getMemberRole(organizationId, userId),
    enabled: !!organizationId && !!userId,
  });
}
