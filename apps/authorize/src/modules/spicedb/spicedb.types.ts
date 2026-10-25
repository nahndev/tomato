import type { SpiceDbObject, SpiceDbRelation } from './spicedb.constants';

export interface SpiceDbRef {
  type: SpiceDbObject;
  id: string;
}

export interface SpiceDbRelationship {
  resource: SpiceDbRef;
  relation: SpiceDbRelation;
  subject: SpiceDbRef;
}
