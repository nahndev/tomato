import type { PermissionResourceRef } from "@tomato/types";

export const permissionKeys = {
  all: (departmentId: string) =>
    ["departments", departmentId, "permissions"] as const,
  byResource: (departmentId: string, { type, id }: PermissionResourceRef) =>
    [...permissionKeys.all(departmentId), type, id] as const,
};
