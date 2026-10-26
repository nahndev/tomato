import type { PermissionResource } from '@tomato/constants';

export interface PermissionResourceRef {
  type: PermissionResource;
  id: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  resource: PermissionResourceRef;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
}
