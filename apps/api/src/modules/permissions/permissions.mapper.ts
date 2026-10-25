import type { RolePermission } from "@tomato/types";
import type { PermissionResource } from "@tomato/constants";
import type { RolePermission as RolePermissionEntity } from "../../generated/prisma/client";

export function toRolePermission(entity: RolePermissionEntity): RolePermission {
  return {
    id: entity.id,
    departmentId: entity.departmentId,
    roleId: entity.roleId,
    resource: entity.resource as PermissionResource,
    canCreate: entity.canCreate,
    canRead: entity.canRead,
    canUpdate: entity.canUpdate,
    canDelete: entity.canDelete,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
