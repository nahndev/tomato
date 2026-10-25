import { SpiceDbObject, SpiceDbRelation } from '../spicedb/spicedb.constants';
import type { SpiceDbRelationship } from '../spicedb/spicedb.types';
import { CdcTable } from './cdc.constants';
import { documentRowSchema, isInsertOperation, userRowSchema } from './cdc.types';
import type { ChangeEvent } from './cdc.types';

export function mapChange(table: CdcTable, event: ChangeEvent): SpiceDbRelationship[] {
  if (!isInsertOperation(event.op) || !event.after) return [];

  if (table === CdcTable.USERS) {
    const user = userRowSchema.parse(event.after);
    return [
      {
        resource: { type: SpiceDbObject.DEPARTMENT, id: user.department_id },
        relation: SpiceDbRelation.MEMBER,
        subject: { type: SpiceDbObject.USER, id: user.id },
      },
    ];
  }

  const document = documentRowSchema.parse(event.after);
  const resource = { type: SpiceDbObject.DOCUMENT, id: document.id };
  return [
    { resource, relation: SpiceDbRelation.DEPARTMENT, subject: { type: SpiceDbObject.DEPARTMENT, id: document.department_id } },
    { resource, relation: SpiceDbRelation.OWNER, subject: { type: SpiceDbObject.USER, id: document.owner_id } },
  ];
}
