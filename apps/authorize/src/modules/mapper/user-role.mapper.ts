import { Injectable } from '@nestjs/common';
import { SpiceDbObject, SpiceDbRelation } from '../spicedb/spicedb.constants';
import type { SpiceDbRelationship } from '../spicedb/spicedb.types';
import { userRoleRowSchema } from './mapper.schemas';
import type { RelationshipMapper } from './relationship-mapper.types';

@Injectable()
export class UserRoleMapper implements RelationshipMapper {
  supports() {
    return true;
  }

  toRelationships(row: unknown): SpiceDbRelationship[] {
    const { user_id, role_id } = userRoleRowSchema.parse(row);
    return [
      {
        resource: { type: SpiceDbObject.ROLE, id: role_id },
        relation: SpiceDbRelation.MEMBER,
        subject: { type: SpiceDbObject.USER, id: user_id },
      },
    ];
  }
}
