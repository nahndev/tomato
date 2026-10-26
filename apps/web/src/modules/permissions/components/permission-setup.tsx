"use client";

import type { PermissionAction } from "@tomato/constants";
import type { PermissionResourceRef } from "@tomato/types";
import { Spinner, Toaster, toast } from "@tomato/ui";
import { useState } from "react";
import { useDocuments } from "@/modules/documents";
import { useRoles } from "@/modules/roles";
import { useUsers } from "@/modules/user";
import { usePermissions } from "../hooks/use-permissions";
import { PERMISSION_RESOURCES } from "../permissions.constants";
import type { PermissionGroup } from "../permissions.types";
import { isSameResource, toResourceRef } from "../permissions.utils";
import { PermissionSidebar } from "./permission-sidebar";
import { RolePermissionSetup } from "./role-permission-setup";

export function PermissionSetup({ departmentId }: { departmentId: string }) {
  const [selected, setSelected] = useState<PermissionResourceRef>(
    toResourceRef(PERMISSION_RESOURCES[0].resource),
  );
  const roles = useRoles(departmentId);
  const { documents } = useDocuments(departmentId);
  const { users } = useUsers(departmentId);
  const { permissions, savingRoleId, toggle, ...permissionState } =
    usePermissions(departmentId, selected);

  const itemsByResource = {
    document: documents.map(({ id, title }) => ({ id, label: title })),
    user: users.map(({ id, name }) => ({ id, label: name })),
  };
  const groups: PermissionGroup[] = PERMISSION_RESOURCES.map(
    ({ resource: type, label }) => ({
      type,
      resource: toResourceRef(type),
      label,
      items: itemsByResource[type].map((item) => ({
        resource: toResourceRef(type, item.id),
        label: item.label,
      })),
    }),
  );
  const selectedItem = groups
    .flatMap((group) => [group, ...group.items])
    .find((item) => isSameResource(item.resource, selected));

  const isLoading = roles.isLoading || permissionState.isLoading;
  const hasError = roles.hasError || permissionState.hasError;

  async function handleToggle(
    roleId: string,
    action: PermissionAction,
    value: boolean,
  ) {
    try {
      await toggle({ roleId, action, value });
    } catch {
      toast.error("Could not save the permission");
    }
  }

  return (
    <div className="flex w-full flex-1 gap-6">
      <PermissionSidebar
        groups={groups}
        selected={selected}
        onSelect={setSelected}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <h2 className="truncate text-lg font-medium">{selectedItem?.label}</h2>
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
            <RolePermissionSetup
              key={role.id}
              role={role}
              permission={permissions.find((item) => item.roleId === role.id)}
              isDisabled={savingRoleId === role.id}
              onToggle={(action, value) => handleToggle(role.id, action, value)}
            />
          ))
        )}
      </div>
      <Toaster />
    </div>
  );
}
