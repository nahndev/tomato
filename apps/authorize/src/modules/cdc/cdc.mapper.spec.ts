import { describe, expect, it } from 'vitest';
import { CdcTable } from './cdc.constants';
import { mapChange } from './cdc.mapper';

const USER_ID = '0192f3a0-0000-7000-8000-000000000001';
const DEPARTMENT_ID = '0192f3a0-0000-7000-8000-000000000002';
const DOCUMENT_ID = '0192f3a0-0000-7000-8000-000000000003';
const ROLE_ID = '0192f3a0-0000-7000-8000-000000000004';

describe('mapChange', () => {
  it('adds the user to its department', () => {
    expect(mapChange(CdcTable.USERS, { op: 'c', after: { id: USER_ID, department_id: DEPARTMENT_ID } }).touch).toEqual([
      {
        resource: { type: 'department', id: DEPARTMENT_ID },
        relation: 'member',
        subject: { type: 'user', id: USER_ID },
      },
    ]);
  });

  it('links a document to its department and owner', () => {
    const { touch: relationships } = mapChange(CdcTable.DOCUMENTS, {
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
    expect(mapChange(CdcTable.USERS, { op: 'r', after: { id: USER_ID, department_id: DEPARTMENT_ID } }).touch).toHaveLength(1);
  });

  it('ignores updates and deletes', () => {
    const after = { id: USER_ID, department_id: DEPARTMENT_ID };
    expect(mapChange(CdcTable.USERS, { op: 'u', after })).toEqual({ touch: [], remove: [] });
    expect(mapChange(CdcTable.USERS, { op: 'd', after: null })).toEqual({ touch: [], remove: [] });
  });

  it('rejects rows missing required columns', () => {
    expect(() => mapChange(CdcTable.DOCUMENTS, { op: 'c', after: { id: DOCUMENT_ID } })).toThrow();
  });

  describe('role permissions', () => {
    const row = (flags: Partial<Record<'can_create' | 'can_read' | 'can_update' | 'can_delete', boolean>>) => ({
      id: DOCUMENT_ID,
      department_id: DEPARTMENT_ID,
      role_id: ROLE_ID,
      resource: 'document',
      can_create: false,
      can_read: false,
      can_update: false,
      can_delete: false,
      ...flags,
    });
    const grant = (relation: string) => ({
      resource: { type: 'department', id: DEPARTMENT_ID },
      relation,
      subject: { type: 'role', id: ROLE_ID, relation: 'member' },
    });

    it('grants one relationship per enabled action', () => {
      const changes = mapChange(CdcTable.ROLE_PERMISSIONS, {
        op: 'c',
        before: null,
        after: row({ can_read: true, can_delete: true }),
      });
      expect(changes.touch).toEqual([grant('document_read'), grant('document_delete')]);
      expect(changes.remove).toEqual([]);
    });

    it('revokes only the actions turned off by an update', () => {
      const changes = mapChange(CdcTable.ROLE_PERMISSIONS, {
        op: 'u',
        before: row({ can_read: true, can_update: true }),
        after: row({ can_read: true }),
      });
      expect(changes.touch).toEqual([grant('document_read')]);
      expect(changes.remove).toEqual([grant('document_update')]);
    });

    it('revokes everything on delete', () => {
      const changes = mapChange(CdcTable.ROLE_PERMISSIONS, {
        op: 'd',
        before: row({ can_create: true, can_read: true }),
        after: null,
      });
      expect(changes.touch).toEqual([]);
      expect(changes.remove).toEqual([grant('document_create'), grant('document_read')]);
    });

    it('ignores unknown resources', () => {
      const after = { ...row({ can_read: true }), resource: 'unknown' };
      expect(mapChange(CdcTable.ROLE_PERMISSIONS, { op: 'c', after })).toEqual({ touch: [], remove: [] });
    });
  });
});
