import { PermissionAction, PermissionResource } from "@tomato/constants";

export const PERMISSION_LIST_PAGE_SIZE = 100;

export const PermissionFlag = {
  [PermissionAction.CREATE]: "canCreate",
  [PermissionAction.READ]: "canRead",
  [PermissionAction.UPDATE]: "canUpdate",
  [PermissionAction.DELETE]: "canDelete",
} as const;
export type PermissionFlag = (typeof PermissionFlag)[PermissionAction];

export const PERMISSION_ACTIONS = [
  { action: PermissionAction.CREATE, label: "Create" },
  { action: PermissionAction.READ, label: "Read" },
  { action: PermissionAction.UPDATE, label: "Update" },
  { action: PermissionAction.DELETE, label: "Delete" },
] as const;

export const PERMISSION_RESOURCES = [
  { resource: PermissionResource.DOCUMENT, label: "Documents" },
] as const;
