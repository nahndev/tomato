import { GroupType } from '@tomato/constants';
import { describe, expect, it, vi } from 'vitest';
import type { GroupsService } from '../groups/groups.service';
import { CdcOperation } from './cdc.constants';
import { CdcService } from './cdc.service';

const ID = 'b1d2c3e4-0a1b-4c2d-8e3f-1a2b3c4d5e6f';

function setup() {
  const groupsService = { seed: vi.fn(async () => undefined) };
  return { groupsService, service: new CdcService(groupsService as unknown as GroupsService) };
}

describe('CdcService', () => {
  it.each([CdcOperation.CREATE, CdcOperation.READ])('seeds a group on op %s', async (op) => {
    const { service, groupsService } = setup();

    await service.seedGroup(GroupType.USER, { op, after: { id: ID } });

    expect(groupsService.seed).toHaveBeenCalledWith(GroupType.USER, ID);
  });

  it('ignores updates, deletes and tombstones', async () => {
    const { service, groupsService } = setup();

    await service.seedGroup(GroupType.USER, { op: 'u', after: { id: ID } });
    await service.seedGroup(GroupType.USER, { op: 'd', after: null });
    await service.seedGroup(GroupType.USER, null);

    expect(groupsService.seed).not.toHaveBeenCalled();
  });
});
