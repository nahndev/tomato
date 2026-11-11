import type { PermissionResource } from "@tomato/constants";
import type { PermissionFlag } from "./permissions.constants";

export interface PermissionResourceRef {
  type: PermissionResource;
  id: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  resourceType: PermissionResource;
  resourceId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PermissionFlags = Partial<Record<PermissionFlag, boolean>>;

export interface PermissionItem {
  resource: PermissionResourceRef;
  label: string;
}

export interface PermissionGroup extends PermissionItem {
  type: PermissionResource;
  items: PermissionItem[];
}
