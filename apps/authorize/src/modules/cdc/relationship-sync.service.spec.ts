import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RelationshipService } from '../relationship/relationship.service';
import { DocumentMapper } from '../mapper/document.mapper';
import { RelationshipMapperRegistry } from '../mapper/relationship-mapper.registry';
import { RoleMapper } from '../mapper/role.mapper';
import { RolePermissionMapper } from '../mapper/role-permission.mapper';
import { UserMapper } from '../mapper/user.mapper';
import { CdcTable } from './cdc.constants';
import { RelationshipSyncService } from './relationship-sync.service';

const USER_ID = '0192f3a0-0000-7000-8000-000000000001';
const DEPARTMENT_ID = '0192f3a0-0000-7000-8000-000000000002';
const DOCUMENT_ID = '0192f3a0-0000-7000-8000-000000000003';
const ROLE_ID = '0192f3a0-0000-7000-8000-000000000004';

const user = { id: USER_ID, department_id: DEPARTMENT_ID };
const role = { id: ROLE_ID, department_id: DEPARTMENT_ID };
const document = { id: DOCUMENT_ID, department_id: DEPARTMENT_ID, owner_id: USER_ID };
const permission = (canRead: boolean) => ({
  role_id: ROLE_ID,
  resource_type: 'document',
  resource_id: 'all',
  can_create: false,
  can_read: canRead,
  can_update: false,
  can_delete: false,
});

describe('RelationshipSyncService', () => {
  let replace: ReturnType<typeof vi.fn>;
  let service: RelationshipSyncService;

  beforeEach(() => {
    replace = vi.fn().mockResolvedValue(undefined);
    service = new RelationshipSyncService(
      new RelationshipMapperRegistry(new UserMapper(),
        new RoleMapper(),
        new DocumentMapper(),
        new RolePermissionMapper(),),
      { replace } as unknown as RelationshipService,
    );
  });

  describe.each([
    [CdcTable.USERS, user],
    [CdcTable.ROLES, role],
    [CdcTable.DOCUMENTS, document],
  ])('insert-only %s', (table, row) => {
    it.each(['c', 'r'])('applies %s events', async (op) => {
      await service.sync(table, { op, after: row });
      expect(replace).toHaveBeenCalledWith([], expect.any(Array));
    });

    it('ignores updates, deletes and empty payloads', async () => {
      await service.sync(table, { op: 'u', before: row, after: row });
      await service.sync(table, { op: 'd', before: row, after: null });
      await service.sync(table, null);
      expect(replace).not.toHaveBeenCalled();
    });
  });

  it('rejects rows missing required columns without writing', async () => {
    await expect(service.sync(CdcTable.DOCUMENTS, { op: 'c', after: { id: DOCUMENT_ID } })).rejects.toThrow();
    expect(replace).not.toHaveBeenCalled();
  });

  describe('role permission', () => {
    it('passes the old and new row on update', async () => {
      await service.sync(CdcTable.ROLE_PERMISSIONS, { op: 'u', before: permission(true), after: permission(false) });
      const [before, after] = replace.mock.calls[0];
      expect(before).toHaveLength(1);
      expect(after).toHaveLength(0);
    });

    it('passes no new row on delete', async () => {
      await service.sync(CdcTable.ROLE_PERMISSIONS, { op: 'd', before: permission(true), after: null });
      expect(replace).toHaveBeenCalledWith([expect.anything()], []);
    });
  });
});
