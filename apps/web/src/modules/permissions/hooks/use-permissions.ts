"use client";

import type { PermissionAction, PermissionResource } from "@tomato/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PERMISSION_ACTIONS, PermissionFlag } from "../permissions.constants";
import { permissionKeys } from "../permissions.keys";
import {
  createPermission,
  deletePermission,
  listPermissions,
  updatePermission,
} from "../services/permissions.service";

interface ToggleInput {
  roleId: string;
  resource: PermissionResource;
  action: PermissionAction;
  value: boolean;
}

export function usePermissions(departmentId: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: permissionKeys.all(departmentId),
    });

  const { data, isLoading, isError } = useQuery({
    queryKey: permissionKeys.all(departmentId),
    queryFn: () => listPermissions(departmentId),
  });
  const permissions = data?.items ?? [];

  const toggleMutation = useMutation({
    mutationFn: async ({ roleId, resource, action, value }: ToggleInput) => {
      const flag = PermissionFlag[action];
      const current = permissions.find(
        (item) => item.roleId === roleId && item.resource === resource,
      );
      if (!current) {
        await createPermission(departmentId, {
          roleId,
          resource,
          [flag]: value,
        });
        return;
      }
      const isStillGranted = PERMISSION_ACTIONS.some(({ action: other }) =>
        other === action ? value : current[PermissionFlag[other]],
      );
      if (isStillGranted) {
        await updatePermission(departmentId, current.id, { [flag]: value });
      } else {
        await deletePermission(departmentId, current.id);
      }
    },
    onSuccess: invalidate,
  });

  return {
    permissions,
    isLoading,
    hasError: isError,
    isSaving: toggleMutation.isPending,
    toggle: async (input: ToggleInput) => {
      await toggleMutation.mutateAsync(input);
    },
  };
}
