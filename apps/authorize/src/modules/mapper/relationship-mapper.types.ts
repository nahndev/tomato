import type { SpiceDbRelationship } from '../spicedb/spicedb.types';

export interface RelationshipMapper {
  supports(op: string): boolean;
  toRelationships(row: unknown): SpiceDbRelationship[];
}
