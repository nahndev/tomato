import { PermissionAction } from '@tomato/constants';

export const SpiceDbObject = {
  USER: 'user',
  DEPARTMENT: 'department',
  DOCUMENT: 'document',
  ROLE: 'role',
} as const;
export type SpiceDbObject = (typeof SpiceDbObject)[keyof typeof SpiceDbObject];

export const SpiceDbRelation = {
  MEMBER: 'member',
  DEPARTMENT: 'department',
  ROLE: 'role',
  OWNER: 'owner',
} as const;
export type SpiceDbRelation = (typeof SpiceDbRelation)[keyof typeof SpiceDbRelation];

export const ItemRelation = {
  [PermissionAction.CREATE]: 'creator',
  [PermissionAction.READ]: 'reader',
  [PermissionAction.UPDATE]: 'updater',
  [PermissionAction.DELETE]: 'deleter',
} as const;
export type ItemRelation = (typeof ItemRelation)[PermissionAction];

export const SPICEDB_SCHEMA_FILE = 'schema.zed';
