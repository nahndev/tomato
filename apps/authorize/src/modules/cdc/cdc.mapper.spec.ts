import { describe, expect, it } from 'vitest';
import { CdcTable } from './cdc.constants';
import { mapChange } from './cdc.mapper';

const USER_ID = '0192f3a0-0000-7000-8000-000000000001';
const DEPARTMENT_ID = '0192f3a0-0000-7000-8000-000000000002';
const DOCUMENT_ID = '0192f3a0-0000-7000-8000-000000000003';

describe('mapChange', () => {
  it('adds the user to its department', () => {
    expect(mapChange(CdcTable.USERS, { op: 'c', after: { id: USER_ID, department_id: DEPARTMENT_ID } })).toEqual([
      {
        resource: { type: 'department', id: DEPARTMENT_ID },
        relation: 'member',
        subject: { type: 'user', id: USER_ID },
      },
    ]);
  });

  it('links a document to its department and owner', () => {
    const relationships = mapChange(CdcTable.DOCUMENTS, {
      op: 'c',
      after: { id: DOCUMENT_ID, department_id: DEPARTMENT_ID, owner_id: USER_ID },
    });
    expect(relationships).toEqual([
      {
        resource: { type: 'document', id: DOCUMENT_ID },
        relation: 'department',
        subject: { type: 'department', id: DEPARTMENT_ID },
      },
      { resource: { type: 'document', id: DOCUMENT_ID }, relation: 'owner', subject: { type: 'user', id: USER_ID } },
    ]);
  });

  it('treats snapshot reads as inserts', () => {
    expect(mapChange(CdcTable.USERS, { op: 'r', after: { id: USER_ID, department_id: DEPARTMENT_ID } })).toHaveLength(1);
  });

  it('ignores updates and deletes', () => {
    const after = { id: USER_ID, department_id: DEPARTMENT_ID };
    expect(mapChange(CdcTable.USERS, { op: 'u', after })).toEqual([]);
    expect(mapChange(CdcTable.USERS, { op: 'd', after: null })).toEqual([]);
  });

  it('rejects rows missing required columns', () => {
    expect(() => mapChange(CdcTable.DOCUMENTS, { op: 'c', after: { id: DOCUMENT_ID } })).toThrow();
  });
});
