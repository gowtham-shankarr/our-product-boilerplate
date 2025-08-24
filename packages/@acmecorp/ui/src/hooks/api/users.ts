import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys, queryConfig } from "@acmecorp/api/rq";
import type { CreateUser, UpdateUser, UserListQuery } from "@acmecorp/api";

// Query hooks
export const useUsers = (filters?: UserListQuery) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => api.users.list({ query: filters }),
    ...queryConfig.list,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => api.users.getById({ params: { id } }),
    enabled: !!id,
    ...queryConfig.detail,
  });
};

// Mutation hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUser) => api.users.create({ body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUser }) =>
      api.users.update({ params: { id }, body: data }),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.users.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.users.delete({ params: { id } }),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
};
