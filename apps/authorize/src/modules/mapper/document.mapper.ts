import { Injectable } from '@nestjs/common';
import { isInsertOperation } from '../cdc/cdc.types';
import { SpiceDbObject, SpiceDbRelation } from '../spicedb/spicedb.constants';
import type { SpiceDbRelationship } from '../spicedb/spicedb.types';
import { documentRowSchema } from './mapper.schemas';
import type { RelationshipMapper } from './relationship-mapper.types';

@Injectable()
export class DocumentMapper implements RelationshipMapper {
  supports(op: string) {
    return isInsertOperation(op);
  }

  toRelationships(row: unknown): SpiceDbRelationship[] {
    const { id, department_id, owner_id } = documentRowSchema.parse(row);
    const resource = { type: SpiceDbObject.DOCUMENT, id };
    return [
      { resource, relation: SpiceDbRelation.DEPARTMENT, subject: { type: SpiceDbObject.DEPARTMENT, id: department_id } },
      { resource, relation: SpiceDbRelation.OWNER, subject: { type: SpiceDbObject.USER, id: owner_id } },
    ];
  }
}
