import { PermissionAction, PermissionResource } from '@tomato/constants';
import { SpiceDbObject, SpiceDbRelation } from '../spicedb/spicedb.constants';
import type { PermissionRelation, SpiceDbChanges, SpiceDbRelationship } from '../spicedb/spicedb.types';
import { CdcTable } from './cdc.constants';
import { documentRowSchema, isInsertOperation, rolePermissionRowSchema, userRowSchema } from './cdc.types';
import type { ChangeEvent } from './cdc.types';

type RolePermissionRow = ReturnType<typeof rolePermissionRowSchema.parse>;

const ROW_FLAG_BY_ACTION = {
  [PermissionAction.CREATE]: 'can_create',
  [PermissionAction.READ]: 'can_read',
  [PermissionAction.UPDATE]: 'can_update',
  [PermissionAction.DELETE]: 'can_delete',
} as const satisfies Record<PermissionAction, keyof RolePermissionRow>;

const isPermissionResource = (value: string): value is PermissionResource =>
  (Object.values(PermissionResource) as string[]).includes(value);

const relationshipKey = ({ resource, relation, subject }: SpiceDbRelationship) =>
  `${resource.type}:${resource.id}#${relation}@${subject.type}:${subject.id}#${subject.relation ?? ''}`;

function grantedRelationships(row: unknown): SpiceDbRelationship[] {
  const { department_id, role_id, resource, ...flags } = rolePermissionRowSchema.parse(row);
  if (!isPermissionResource(resource)) return [];

  return Object.values(PermissionAction)
    .filter((action) => flags[ROW_FLAG_BY_ACTION[action]])
    .map((action) => ({
      resource: { type: SpiceDbObject.DEPARTMENT, id: department_id },
      relation: `${resource}_${action}` satisfies PermissionRelation,
      subject: { type: SpiceDbObject.ROLE, id: role_id, relation: SpiceDbRelation.MEMBER },
    }));
}

function mapRolePermission({ before, after }: ChangeEvent): SpiceDbChanges {
  const touch = after ? grantedRelationships(after) : [];
  const kept = new Set(touch.map(relationshipKey));
  const remove = (before ? grantedRelationships(before) : []).filter((item) => !kept.has(relationshipKey(item)));
  return { touch, remove };
}

export function mapChange(table: CdcTable, event: ChangeEvent): SpiceDbChanges {
  if (table === CdcTable.ROLE_PERMISSIONS) return mapRolePermission(event);
  if (!isInsertOperation(event.op) || !event.after) return { touch: [], remove: [] };

  if (table === CdcTable.USERS) {
    const user = userRowSchema.parse(event.after);
    return {
      touch: [
        {
          resource: { type: SpiceDbObject.DEPARTMENT, id: user.department_id },
          relation: SpiceDbRelation.MEMBER,
          subject: { type: SpiceDbObject.USER, id: user.id },
        },
      ],
      remove: [],
    };
  }

  const document = documentRowSchema.parse(event.after);
  const resource = { type: SpiceDbObject.DOCUMENT, id: document.id };
  return {
    touch: [
      { resource, relation: SpiceDbRelation.DEPARTMENT, subject: { type: SpiceDbObject.DEPARTMENT, id: document.department_id } },
      { resource, relation: SpiceDbRelation.OWNER, subject: { type: SpiceDbObject.USER, id: document.owner_id } },
    ],
    remove: [],
  };
}
