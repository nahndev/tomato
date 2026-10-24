"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "../user.keys";
import type { UserInput } from "../user.schemas";
import { createUser, deleteUser, listUsers, updateUser } from "../services/users.service";

export function useUsers(departmentId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: userKeys.all(departmentId) });

  const { data, isLoading, isError } = useQuery({
    queryKey: userKeys.all(departmentId),
    queryFn: () => listUsers(departmentId),
  });

  const addMutation = useMutation({
    mutationFn: (input: UserInput) => createUser(departmentId, input),
    onSuccess: invalidate,
  });
  const editMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<UserInput> }) => updateUser(departmentId, id, input),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteUser(departmentId, id),
    onSuccess: invalidate,
  });

  return {
    users: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: async (input: UserInput) => {
      await addMutation.mutateAsync(input);
    },
    edit: async (id: string, input: Partial<UserInput>) => {
      await editMutation.mutateAsync({ id, input });
    },
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}
