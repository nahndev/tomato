import type { PermissionResource } from "@tomato/constants";
import type { RolePermission } from "@tomato/types";
import type { RolePermission as RolePermissionEntity } from "../../generated/prisma/client";

export function toRolePermission(entity: RolePermissionEntity): RolePermission {
  return {
    id: entity.id,
    roleId: entity.roleId,
    resource: {
      type: entity.resourceType as PermissionResource,
      id: entity.resourceId,
    },
    canCreate: entity.canCreate,
    canRead: entity.canRead,
    canUpdate: entity.canUpdate,
    canDelete: entity.canDelete,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
