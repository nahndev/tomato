import { Injectable } from "@nestjs/common";
import { PermissionAction, PermissionResource } from "@tomato/constants";
import { ItemRelation, SpiceDbObject } from "../spicedb/spicedb.constants";
import type { SpiceDbRef, SpiceDbRelationship } from "../spicedb/spicedb.types";
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
    const {
      role_id,
      resource_type: type,
      resource_id: id,
      ...flags
    } = rolePermissionRowSchema.parse(row);
    if (!isPermissionResource(type)) return [];

    const permissionRelation = {
      [PermissionAction.CREATE]: flags.can_create,
      [PermissionAction.READ]: flags.can_read,
      [PermissionAction.UPDATE]: flags.can_update,
      [PermissionAction.DELETE]: flags.can_delete,
    } satisfies Record<PermissionAction, boolean>;

    const subject: SpiceDbRef = { type: SpiceDbObject.ROLE, id: role_id };
    const resource: SpiceDbRef = { type, id };

    return Object.values(PermissionAction)
      .filter((action) => permissionRelation[action])
      .map((action) => ({ resource, relation: ItemRelation[action], subject }));
  }
}
