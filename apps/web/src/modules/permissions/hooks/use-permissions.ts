"use client";

import type { PermissionAction } from "@tomato/constants";
import type { PermissionResourceRef } from "@tomato/types";
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
  action: PermissionAction;
  value: boolean;
}

export function usePermissions(
  departmentId: string,
  resource: PermissionResourceRef,
) {
  const queryClient = useQueryClient();
  const queryKey = permissionKeys.byResource(departmentId, resource);

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => listPermissions(departmentId, resource),
  });
  const permissions = data?.items ?? [];

  const toggleMutation = useMutation({
    mutationFn: async ({ roleId, action, value }: ToggleInput) => {
      const flag = PermissionFlag[action];
      const current = permissions.find((item) => item.roleId === roleId);
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    permissions,
    isLoading,
    hasError: isError,
    savingRoleId: toggleMutation.isPending
      ? toggleMutation.variables?.roleId
      : undefined,
    toggle: async (input: ToggleInput) => {
      await toggleMutation.mutateAsync(input);
    },
  };
}
