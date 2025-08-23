import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamService } from "../services";
import type {
  CreateTeamForm,
  UpdateTeamForm,
  AssignTeamMemberForm,
  TeamFilters,
  PaginationParams,
} from "../types";

// Query keys
export const teamKeys = {
  all: ["teams"] as const,
  lists: () => [...teamKeys.all, "list"] as const,
  list: (
    organizationId: string,
    filters: TeamFilters,
    pagination: PaginationParams
  ) => [...teamKeys.lists(), organizationId, { filters, pagination }] as const,
  details: () => [...teamKeys.all, "detail"] as const,
  detail: (organizationId: string, teamId: string) =>
    [...teamKeys.details(), organizationId, teamId] as const,
  members: (organizationId: string, teamId: string) =>
    [...teamKeys.detail(organizationId, teamId), "members"] as const,
  memberTeams: (organizationId: string, memberId: string) =>
    [...teamKeys.all, organizationId, "member", memberId] as const,
  stats: (organizationId: string) =>
    [...teamKeys.all, organizationId, "stats"] as const,
};

/**
 * Hook to get team by ID
 */
export function useTeam(organizationId: string, teamId: string) {
  return useQuery({
    queryKey: teamKeys.detail(organizationId, teamId),
    queryFn: () => teamService.getById(organizationId, teamId),
    enabled: !!organizationId && !!teamId,
  });
}

/**
 * Hook to list teams in organization
 */
export function useTeams(
  organizationId: string,
  filters: TeamFilters = {},
  pagination: PaginationParams = {}
) {
  return useQuery({
    queryKey: teamKeys.list(organizationId, filters, pagination),
    queryFn: () => teamService.list(organizationId, filters, pagination),
    enabled: !!organizationId,
  });
}

/**
 * Hook to get team members
 */
export function useTeamMembers(
  organizationId: string,
  teamId: string,
  pagination: PaginationParams = {}
) {
  return useQuery({
    queryKey: teamKeys.members(organizationId, teamId),
    queryFn: () => teamService.getMembers(organizationId, teamId, pagination),
    enabled: !!organizationId && !!teamId,
  });
}

/**
 * Hook to get teams for a member
 */
export function useMemberTeams(organizationId: string, memberId: string) {
  return useQuery({
    queryKey: teamKeys.memberTeams(organizationId, memberId),
    queryFn: () => teamService.getMemberTeams(organizationId, memberId),
    enabled: !!organizationId && !!memberId,
  });
}

/**
 * Hook to get team statistics
 */
export function useTeamStats(organizationId: string) {
  return useQuery({
    queryKey: teamKeys.stats(organizationId),
    queryFn: () => teamService.getStats(organizationId),
    enabled: !!organizationId,
  });
}

/**
 * Hook to create team
 */
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: {
      organizationId: string;
      data: CreateTeamForm;
    }) => teamService.create(organizationId, data),
    onSuccess: (_, { organizationId }) => {
      // Invalidate team lists for this organization
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
        predicate: (query) => query.queryKey.includes(organizationId),
      });
    },
  });
}

/**
 * Hook to update team
 */
export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      teamId,
      data,
    }: {
      organizationId: string;
      teamId: string;
      data: UpdateTeamForm;
    }) => teamService.update(organizationId, teamId, data),
    onSuccess: (data, { organizationId }) => {
      // Invalidate specific team
      queryClient.invalidateQueries({
        queryKey: teamKeys.detail(organizationId, data.id),
      });
      // Invalidate team lists for this organization
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
        predicate: (query) => query.queryKey.includes(organizationId),
      });
    },
  });
}

/**
 * Hook to delete team
 */
export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      teamId,
    }: {
      organizationId: string;
      teamId: string;
    }) => teamService.delete(organizationId, teamId),
    onSuccess: (_, { organizationId }) => {
      // Invalidate team lists for this organization
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
        predicate: (query) => query.queryKey.includes(organizationId),
      });
    },
  });
}

/**
 * Hook to assign member to team
 */
export function useAssignTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      teamId,
      data,
    }: {
      organizationId: string;
      teamId: string;
      data: AssignTeamMemberForm;
    }) => teamService.assignMember(organizationId, teamId, data),
    onSuccess: (_, { organizationId, teamId, data }) => {
      // Invalidate team members
      queryClient.invalidateQueries({
        queryKey: teamKeys.members(organizationId, teamId),
      });
      // Invalidate member teams
      queryClient.invalidateQueries({
        queryKey: teamKeys.memberTeams(organizationId, data.memberId),
      });
    },
  });
}

/**
 * Hook to remove member from team
 */
export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      teamId,
      memberId,
    }: {
      organizationId: string;
      teamId: string;
      memberId: string;
    }) => teamService.removeMember(organizationId, teamId, memberId),
    onSuccess: (_, { organizationId, teamId, memberId }) => {
      // Invalidate team members
      queryClient.invalidateQueries({
        queryKey: teamKeys.members(organizationId, teamId),
      });
      // Invalidate member teams
      queryClient.invalidateQueries({
        queryKey: teamKeys.memberTeams(organizationId, memberId),
      });
    },
  });
}

/**
 * Hook to check if member is in team
 */
export function useIsMemberInTeam(
  organizationId: string,
  teamId: string,
  memberId: string
) {
  return useQuery({
    queryKey: ["teams", "is-member", organizationId, teamId, memberId],
    queryFn: () => teamService.isMemberInTeam(organizationId, teamId, memberId),
    enabled: !!organizationId && !!teamId && !!memberId,
  });
}

/**
 * Hook to get member role in team
 */
export function useMemberTeamRole(
  organizationId: string,
  teamId: string,
  memberId: string
) {
  return useQuery({
    queryKey: ["teams", "member-role", organizationId, teamId, memberId],
    queryFn: () =>
      teamService.getMemberTeamRole(organizationId, teamId, memberId),
    enabled: !!organizationId && !!teamId && !!memberId,
  });
}
