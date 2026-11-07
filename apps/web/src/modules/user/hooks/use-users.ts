"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse, User } from "@tomato/types";
import { userKeys } from "../user.keys";
import type { UserDetailInput, UserInput } from "../user.schemas";
import { createUser, deleteUser, getUser, listUsers, updateUser, uploadUserAvatar } from "../services/users.service";

export function useUsers(departmentId: string, roleId?: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: userKeys.all(departmentId), exact: true }),
      queryClient.invalidateQueries({ queryKey: userKeys.byRole(departmentId) }),
    ]);
  const cacheUser = (user: User) => queryClient.setQueryData(userKeys.detail(departmentId, user.id), user);

  const { data, isLoading, isError } = useQuery({
    queryKey: userKeys.list(departmentId, roleId),
    queryFn: () => listUsers(departmentId, roleId),
  });

  const addMutation = useMutation({
    mutationFn: (input: UserInput) => createUser(departmentId, input),
    onSuccess: (user) => {
      cacheUser(user);
      void invalidate();
    },
  });
  const editMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<UserDetailInput> }) =>
      updateUser(departmentId, id, input),
    onSuccess: (user) => {
      cacheUser(user);
      return invalidate();
    },
  });
  const uploadAvatarMutation = useMutation({
    mutationFn: ({ id, fileId }: { id: string; fileId: string }) => uploadUserAvatar(departmentId, id, fileId),
    onSuccess: (user) => {
      cacheUser(user);
      return invalidate();
    },
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteUser(departmentId, id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(departmentId, id) });
      return invalidate();
    },
  });

  return {
    users: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: (input: UserInput) => addMutation.mutateAsync(input),
    edit: async (id: string, input: Partial<UserDetailInput>) => {
      await editMutation.mutateAsync({ id, input });
    },
    uploadAvatar: async (id: string, fileId: string) => {
      await uploadAvatarMutation.mutateAsync({ id, fileId });
    },
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}

export function useUser(departmentId: string, id: string) {
  const queryClient = useQueryClient();
  const listKey = userKeys.all(departmentId);

  const { data, isError } = useQuery({
    queryKey: userKeys.detail(departmentId, id),
    queryFn: () => getUser(departmentId, id),
    initialData: () => queryClient.getQueryData<PaginatedResponse<User>>(listKey)?.items.find((user) => user.id === id),
    initialDataUpdatedAt: () => queryClient.getQueryState(listKey)?.dataUpdatedAt,
  });

  return { user: data, hasError: isError };
}
