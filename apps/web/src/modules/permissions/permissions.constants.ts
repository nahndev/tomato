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
  { action: PermissionAction.CREATE, label: "Create", description: "Can create new items" },
  { action: PermissionAction.READ, label: "Read", description: "Can view the item" },
  { action: PermissionAction.UPDATE, label: "Update", description: "Can edit the item" },
  { action: PermissionAction.DELETE, label: "Delete", description: "Can delete the item" },
] as const;

export const PERMISSION_RESOURCES = [
  { resource: PermissionResource.DOCUMENT, label: "Documents" },
  { resource: PermissionResource.USER, label: "Users" },
] as const;
