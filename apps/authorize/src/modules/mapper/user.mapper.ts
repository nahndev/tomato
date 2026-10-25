import { Injectable } from '@nestjs/common';
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
    return [
      {
        resource: { type: SpiceDbObject.DEPARTMENT, id: department_id },
        relation: SpiceDbRelation.MEMBER,
        subject: { type: SpiceDbObject.USER, id },
      },
    ];
  }
}
