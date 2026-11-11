"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/shared/types/api.types";
import { userKeys } from "@/modules/user";
import { roleKeys } from "../roles.keys";
import type { RoleDetailInput, RoleInput } from "../roles.schemas";
import {
  createRole,
  deleteRole,
  getRole,
  listRoles,
  updateRole,
} from "../services/roles.service";
import type { Role } from "../roles.types";

export function useRoles(departmentId: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: roleKeys.all(departmentId),
      exact: true,
    });

  const invalidateUsers = () =>
    queryClient.invalidateQueries({ queryKey: userKeys.all(departmentId) });

  const { data, isLoading, isError } = useQuery({
    queryKey: roleKeys.all(departmentId),
    queryFn: () => listRoles(departmentId),
  });

  const addMutation = useMutation({
    mutationFn: (input: RoleInput) => createRole(departmentId, input),
    onSuccess: invalidate,
  });
  const editMutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<RoleDetailInput>;
    }) => updateRole(departmentId, id, input),
    onSuccess: (role) => {
      queryClient.setQueryData(roleKeys.detail(departmentId, role.id), role);
      void invalidateUsers();
      return invalidate();
    },
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteRole(departmentId, id),
    onSuccess: () => {
      void invalidateUsers();
      return invalidate();
    },
  });

  return {
    roles: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: async (input: RoleInput) => {
      await addMutation.mutateAsync(input);
    },
    edit: async (id: string, input: Partial<RoleDetailInput>) => {
      await editMutation.mutateAsync({ id, input });
    },
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}

export function useRole(departmentId: string, id: string) {
  const queryClient = useQueryClient();
  const listKey = roleKeys.all(departmentId);

  const { data, isError } = useQuery({
    queryKey: roleKeys.detail(departmentId, id),
    queryFn: () => getRole(departmentId, id),
    initialData: () =>
      queryClient
        .getQueryData<PaginatedResponse<Role>>(listKey)
        ?.items.find((role) => role.id === id),
    initialDataUpdatedAt: () => queryClient.getQueryState(listKey)?.dataUpdatedAt,
  });

  return { role: data, hasError: isError };
}
