export const SpiceDbObject = {
  USER: 'user',
  DEPARTMENT: 'department',
  DOCUMENT: 'document',
} as const;
export type SpiceDbObject = (typeof SpiceDbObject)[keyof typeof SpiceDbObject];

export const SpiceDbRelation = {
  MEMBER: 'member',
  DEPARTMENT: 'department',
  OWNER: 'owner',
} as const;
export type SpiceDbRelation = (typeof SpiceDbRelation)[keyof typeof SpiceDbRelation];

export const SPICEDB_SCHEMA_FILE = 'schema.zed';
