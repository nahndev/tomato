import type { PermissionResource } from '@tomato/constants';

export interface RolePermission {
  id: string;
  departmentId: string;
  roleId: string;
  resource: PermissionResource;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
}
