import { describe, expect, it } from 'vitest';
import { DocumentMapper } from './document.mapper';
import { RoleMapper } from './role.mapper';
import { RolePermissionMapper } from './role-permission.mapper';
import { UserMapper } from './user.mapper';

const USER_ID = '0192f3a0-0000-7000-8000-000000000001';
const DEPARTMENT_ID = '0192f3a0-0000-7000-8000-000000000002';
const DOCUMENT_ID = '0192f3a0-0000-7000-8000-000000000003';
const ROLE_ID = '0192f3a0-0000-7000-8000-000000000004';

describe('relationship mappers', () => {
  it('adds the user to its department', () => {
    expect(new UserMapper().toRelationships({ id: USER_ID, department_id: DEPARTMENT_ID })).toEqual([
      {
        resource: { type: 'department', id: DEPARTMENT_ID },
        relation: 'member',
        subject: { type: 'user', id: USER_ID },
      },
      {
        resource: { type: 'user', id: USER_ID },
        relation: 'department',
        subject: { type: 'department', id: DEPARTMENT_ID },
      },
    ]);
  });

  it('links a role and its department both ways', () => {
    expect(new RoleMapper().toRelationships({ id: ROLE_ID, department_id: DEPARTMENT_ID })).toEqual([
      {
        resource: { type: 'role', id: ROLE_ID },
        relation: 'department',
        subject: { type: 'department', id: DEPARTMENT_ID },
      },
      {
        resource: { type: 'department', id: DEPARTMENT_ID },
        relation: 'role',
        subject: { type: 'role', id: ROLE_ID },
      },
    ]);
  });

  it('links a document to its department and owner', () => {
    const row = { id: DOCUMENT_ID, department_id: DEPARTMENT_ID, owner_id: USER_ID };
    expect(new DocumentMapper().toRelationships(row)).toEqual([
      {
        resource: { type: 'document', id: DOCUMENT_ID },
        relation: 'department',
        subject: { type: 'department', id: DEPARTMENT_ID },
      },
      { resource: { type: 'document', id: DOCUMENT_ID }, relation: 'owner', subject: { type: 'user', id: USER_ID } },
    ]);
  });

  it('rejects rows missing required columns', () => {
    expect(() => new DocumentMapper().toRelationships({ id: DOCUMENT_ID })).toThrow();
  });

  describe('role permission', () => {
    const row = (overrides: object = {}) => ({
      role_id: ROLE_ID,
      resource_type: 'document',
      resource_id: 'all',
      can_create: false,
      can_read: false,
      can_update: false,
      can_delete: false,
      ...overrides,
    });
    const subject = { type: 'role', id: ROLE_ID, relation: 'member' };

    it('grants every item of a type through the role', () => {
      const relationships = new RolePermissionMapper().toRelationships(row({ can_read: true, can_delete: true }));
      expect(relationships).toEqual([
        { resource: { type: 'role', id: ROLE_ID }, relation: 'document_read', subject },
        { resource: { type: 'role', id: ROLE_ID }, relation: 'document_delete', subject },
      ]);
    });

    it('grants a single item directly on the object', () => {
      const relationships = new RolePermissionMapper().toRelationships(
        row({ resource_type: 'user', resource_id: USER_ID, can_update: true }),
      );
      expect(relationships).toEqual([{ resource: { type: 'user', id: USER_ID }, relation: 'updater', subject }]);
    });

    it('grants nothing for unknown resources', () => {
      const relationships = new RolePermissionMapper().toRelationships(row({ resource_type: 'unknown', can_read: true }));
      expect(relationships).toEqual([]);
    });
  });

  describe('supports', () => {
    it('only syncs inserts of users, roles and documents', () => {
      for (const mapper of [new UserMapper(), new RoleMapper(), new DocumentMapper()]) {
        expect(mapper.supports('c')).toBe(true);
        expect(mapper.supports('r')).toBe(true);
        expect(mapper.supports('u')).toBe(false);
        expect(mapper.supports('d')).toBe(false);
      }
    });

    it('syncs every operation of role permissions', () => {
      expect(new RolePermissionMapper().supports()).toBe(true);
    });
  });
});
