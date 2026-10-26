import type { ItemRelation, SpiceDbObject, SpiceDbRelation } from './spicedb.constants';

export interface SpiceDbRef {
  type: SpiceDbObject;
  id: string;
  relation?: SpiceDbRelation;
}

export interface SpiceDbRelationship {
  resource: SpiceDbRef;
  relation: SpiceDbRelation | ItemRelation;
  subject: SpiceDbRef;
}

export interface SpiceDbChanges {
  touch: SpiceDbRelationship[];
  remove: SpiceDbRelationship[];
}
