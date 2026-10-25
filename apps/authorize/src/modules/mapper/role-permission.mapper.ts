import { Injectable } from '@nestjs/common';
import { PermissionAction, PermissionResource } from '@tomato/constants';
import { SpiceDbObject, SpiceDbRelation } from '../spicedb/spicedb.constants';
import type { PermissionRelation, SpiceDbRelationship } from '../spicedb/spicedb.types';
import { rolePermissionRowSchema } from './mapper.schemas';
import type { RelationshipMapper } from './relationship-mapper.types';

const isPermissionResource = (value: string): value is PermissionResource =>
  (Object.values(PermissionResource) as string[]).includes(value);

@Injectable()
export class RolePermissionMapper implements RelationshipMapper {
  supports() {
    return true;
  }

  toRelationships(row: unknown): SpiceDbRelationship[] {
    const { department_id, role_id, resource, ...flags } = rolePermissionRowSchema.parse(row);
    if (!isPermissionResource(resource)) return [];

    const isGranted = {
      [PermissionAction.CREATE]: flags.can_create,
      [PermissionAction.READ]: flags.can_read,
      [PermissionAction.UPDATE]: flags.can_update,
      [PermissionAction.DELETE]: flags.can_delete,
    } satisfies Record<PermissionAction, boolean>;

    return Object.values(PermissionAction)
      .filter((action) => isGranted[action])
      .map((action) => ({
        resource: { type: SpiceDbObject.DEPARTMENT, id: department_id },
        relation: `${resource}_${action}` satisfies PermissionRelation,
        subject: { type: SpiceDbObject.ROLE, id: role_id, relation: SpiceDbRelation.MEMBER },
      }));
  }
}
