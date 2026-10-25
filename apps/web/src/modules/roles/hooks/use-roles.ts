"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roleKeys } from "../roles.keys";
import type { RoleInput } from "../roles.schemas";
import {
  createRole,
  deleteRole,
  listRoles,
  updateRole,
} from "../services/roles.service";

export function useRoles(departmentId: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: roleKeys.all(departmentId) });

  const { data, isLoading, isError } = useQuery({
    queryKey: roleKeys.all(departmentId),
    queryFn: () => listRoles(departmentId),
  });

  const addMutation = useMutation({
    mutationFn: (input: RoleInput) => createRole(departmentId, input),
    onSuccess: invalidate,
  });
  const editMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<RoleInput> }) =>
      updateRole(departmentId, id, input),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteRole(departmentId, id),
    onSuccess: invalidate,
  });

  return {
    roles: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: async (input: RoleInput) => {
      await addMutation.mutateAsync(input);
    },
    edit: async (id: string, input: Partial<RoleInput>) => {
      await editMutation.mutateAsync({ id, input });
    },
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}
