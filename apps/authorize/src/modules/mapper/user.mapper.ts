import { Injectable } from '@nestjs/common';
import { PERMISSION_RESOURCE_ALL } from '@tomato/constants';
import { isInsertOperation } from '../cdc/cdc.types';
import { SpiceDbObject, SpiceDbRelation } from '../spicedb/spicedb.constants';
import type { SpiceDbRelationship } from '../spicedb/spicedb.types';
import { userRowSchema } from './mapper.schemas';
import type { RelationshipMapper } from './relationship-mapper.types';

@Injectable()
export class UserMapper implements RelationshipMapper {
  supports(op: string) {
    return isInsertOperation(op);
  }

  toRelationships(row: unknown): SpiceDbRelationship[] {
    const { id, department_id } = userRowSchema.parse(row);
    const user = { type: SpiceDbObject.USER, id };
    const department = { type: SpiceDbObject.DEPARTMENT, id: department_id };
    return [
      { resource: user, relation: SpiceDbRelation.ALL, subject: { type: SpiceDbObject.USER, id: PERMISSION_RESOURCE_ALL } },
      { resource: department, relation: SpiceDbRelation.MEMBER, subject: user },
      { resource: user, relation: SpiceDbRelation.DEPARTMENT, subject: department },
    ];
  }
}
