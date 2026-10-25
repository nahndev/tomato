"use client";

import { Spinner, Toaster, toast } from "@tomato/ui";
import { useRoles } from "@/modules/roles";
import { usePermissions } from "../hooks/use-permissions";
import { RolePermissionCard } from "./role-permission-card";

export function PermissionList({ departmentId }: { departmentId: string }) {
  const roles = useRoles(departmentId);
  const { permissions, isSaving, toggle, ...permissionState } =
    usePermissions(departmentId);

  const isLoading = roles.isLoading || permissionState.isLoading;
  const hasError = roles.hasError || permissionState.hasError;

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Spinner />
        </div>
      ) : hasError ? (
        <p className="text-sm text-muted-foreground">
          Could not load the permissions.
        </p>
      ) : roles.roles.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No roles yet. Add a role first.
        </p>
      ) : (
        roles.roles.map((role) => (
          <RolePermissionCard
            key={role.id}
            role={role}
            permissions={permissions.filter((item) => item.roleId === role.id)}
            isDisabled={isSaving}
            onToggle={async (resource, action, value) => {
              try {
                await toggle({ roleId: role.id, resource, action, value });
              } catch {
                toast.error("Could not save the permission");
              }
            }}
          />
        ))
      )}
      <Toaster />
    </div>
  );
}
