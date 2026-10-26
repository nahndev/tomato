import { Injectable } from '@nestjs/common';
import { isInsertOperation } from '../cdc/cdc.types';
import { SpiceDbObject, SpiceDbRelation } from '../spicedb/spicedb.constants';
import type { SpiceDbRelationship } from '../spicedb/spicedb.types';
import { roleRowSchema } from './mapper.schemas';
import type { RelationshipMapper } from './relationship-mapper.types';

@Injectable()
export class RoleMapper implements RelationshipMapper {
  supports(op: string) {
    return isInsertOperation(op);
  }

  toRelationships(row: unknown): SpiceDbRelationship[] {
    const { id, department_id } = roleRowSchema.parse(row);
    const role = { type: SpiceDbObject.ROLE, id };
    const department = { type: SpiceDbObject.DEPARTMENT, id: department_id };
    return [
      { resource: role, relation: SpiceDbRelation.DEPARTMENT, subject: department },
      { resource: department, relation: SpiceDbRelation.ROLE, subject: role },
    ];
  }
}
