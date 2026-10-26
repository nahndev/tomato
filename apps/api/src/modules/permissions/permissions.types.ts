export interface PermissionFlags {
  canCreate?: boolean;
  canRead?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export interface PermissionFilter {
  roleId?: string;
  resourceType?: string;
  resourceId?: string;
}
