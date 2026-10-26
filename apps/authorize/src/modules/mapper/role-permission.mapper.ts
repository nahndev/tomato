import { Injectable } from "@nestjs/common";
import {
  PERMISSION_RESOURCE_ALL,
  PermissionAction,
  PermissionResource,
} from "@tomato/constants";
import {
  ItemRelation,
  SpiceDbObject,
  SpiceDbRelation,
} from "../spicedb/spicedb.constants";
import type {
  PermissionRelation,
  SpiceDbRef,
  SpiceDbRelationship,
} from "../spicedb/spicedb.types";
import { rolePermissionRowSchema } from "./mapper.schemas";
import type { RelationshipMapper } from "./relationship-mapper.types";

const isPermissionResource = (value: string): value is PermissionResource =>
  (Object.values(PermissionResource) as string[]).includes(value);

@Injectable()
export class RolePermissionMapper implements RelationshipMapper {
  supports() {
    return true;
  }

  toRelationships(row: unknown): SpiceDbRelationship[] {
    const { role_id, resource_type: type, resource_id: id, ...flags } = rolePermissionRowSchema.parse(row);
    if (!isPermissionResource(type)) return [];

    const isGranted = {
      [PermissionAction.CREATE]: flags.can_create,
      [PermissionAction.READ]: flags.can_read,
      [PermissionAction.UPDATE]: flags.can_update,
      [PermissionAction.DELETE]: flags.can_delete,
    } satisfies Record<PermissionAction, boolean>;

    const role: SpiceDbRef = { type: SpiceDbObject.ROLE, id: role_id };
    const subject: SpiceDbRef = { ...role, relation: SpiceDbRelation.MEMBER };
    const isAll = id === PERMISSION_RESOURCE_ALL;

    return Object.values(PermissionAction)
      .filter((action) => isGranted[action])
      .map((action) => ({
        resource: isAll ? role : { type: type satisfies SpiceDbObject, id },
        relation: isAll
          ? (`${type}_${action}` satisfies PermissionRelation)
          : ItemRelation[action],
        subject,
      }));
  }
}
