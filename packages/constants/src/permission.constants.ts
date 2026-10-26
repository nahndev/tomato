export const PermissionResource = {
  DOCUMENT: 'document',
  USER: 'user',
} as const;
export type PermissionResource = (typeof PermissionResource)[keyof typeof PermissionResource];

export const PermissionAction = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;
export type PermissionAction = (typeof PermissionAction)[keyof typeof PermissionAction];

export const PERMISSION_RESOURCE_ALL = 'all';
