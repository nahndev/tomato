import { GroupType } from '@tomato/constants';
import { describe, expect, it, vi } from 'vitest';
import type { GroupsService } from '../groups/groups.service';
import { CdcOperation } from './cdc.constants';
import { CdcService } from './cdc.service';

const ID = 'b1d2c3e4-0a1b-4c2d-8e3f-1a2b3c4d5e6f';

function setup() {
  const groupsService = { upsert: vi.fn(async () => undefined) };
  return { groupsService, service: new CdcService(groupsService as unknown as GroupsService) };
}

describe('CdcService', () => {
  it.each([CdcOperation.CREATE, CdcOperation.READ, CdcOperation.UPDATE])('syncs a group on op %s', async (op) => {
    const { service, groupsService } = setup();

    await service.syncGroup(GroupType.DEPARTMENT, { op, after: { id: ID, name: 'Sales' } });

    expect(groupsService.upsert).toHaveBeenCalledWith({ type: GroupType.DEPARTMENT, uuid: ID, label: 'Sales' });
  });

  it('labels a user with the full name', async () => {
    const { service, groupsService } = setup();

    await service.syncGroup(GroupType.USER, {
      op: CdcOperation.CREATE,
      after: { id: ID, name: 'Ada', family_name: 'Lovelace' },
    });

    expect(groupsService.upsert).toHaveBeenCalledWith({ type: GroupType.USER, uuid: ID, label: 'Ada Lovelace' });
  });

  it('skips a missing family name', async () => {
    const { service, groupsService } = setup();

    await service.syncGroup(GroupType.USER, {
      op: CdcOperation.CREATE,
      after: { id: ID, name: 'Ada', family_name: null },
    });

    expect(groupsService.upsert).toHaveBeenCalledWith({ type: GroupType.USER, uuid: ID, label: 'Ada' });
  });

  it('ignores deletes and tombstones', async () => {
    const { service, groupsService } = setup();

    await service.syncGroup(GroupType.USER, { op: 'd', after: null });
    await service.syncGroup(GroupType.USER, null);

    expect(groupsService.upsert).not.toHaveBeenCalled();
  });
});
