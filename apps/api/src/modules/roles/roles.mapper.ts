import type { Role } from "@tomato/types";
import type { Role as RoleEntity } from "../../generated/prisma/client";

export function toRole(entity: RoleEntity): Role {
  return {
    id: entity.id,
    departmentId: entity.departmentId,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
