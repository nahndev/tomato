import type { PermissionAction, PermissionResource } from '@tomato/constants';
import type { ItemRelation, SpiceDbObject, SpiceDbRelation } from './spicedb.constants';

export type PermissionRelation = `${PermissionResource}_${PermissionAction}`;

export interface SpiceDbRef {
  type: SpiceDbObject;
  id: string;
  relation?: SpiceDbRelation;
}

export interface SpiceDbRelationship {
  resource: SpiceDbRef;
  relation: SpiceDbRelation | ItemRelation | PermissionRelation;
  subject: SpiceDbRef;
}

export interface SpiceDbChanges {
  touch: SpiceDbRelationship[];
  remove: SpiceDbRelationship[];
}
