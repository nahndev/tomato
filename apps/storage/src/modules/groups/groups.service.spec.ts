import { GroupType } from '@tomato/constants';
import { describe, expect, it, vi } from 'vitest';
import type { ListGroupsQueryDto } from './dto/list-groups-query.dto';
import type { GroupsRepository } from './groups.repository';
import { GroupsService } from './groups.service';

const NOW = new Date('2026-11-07T00:00:00.000Z');
const ISO_NOW = NOW.toISOString();
const ROOT = { id: 'root', parentId: null, name: 'root', createdAt: NOW, updatedAt: NOW };
const ENTITY = {
  id: 'group',
  type: GroupType.USER,
  uuid: 'user',
  label: 'Ada',
  folderId: ROOT.id,
  folder: ROOT,
  createdAt: NOW,
  updatedAt: NOW,
};

function setup() {
  const repository = {
    findMany: vi.fn(async () => ({ items: [ENTITY], total: 1 })),
    upsert: vi.fn(async () => ENTITY),
  };
  return { repository, service: new GroupsService(repository as unknown as GroupsRepository) };
}

describe('GroupsService', () => {
  it('lists groups by type and uuid with their label and root folder', async () => {
    const { service, repository } = setup();
    const query: ListGroupsQueryDto = { type: GroupType.USER, uuid: 'user', page: 2, pageSize: 10 };

    const result = await service.list(query);

    expect(repository.findMany).toHaveBeenCalledWith({ type: GroupType.USER, uuid: 'user' }, 10, 10);
    expect(result).toEqual({
      items: [
        {
          id: 'group',
          type: GroupType.USER,
          uuid: 'user',
          label: 'Ada',
          rootFolder: { id: 'root', parentId: null, name: 'root', createdAt: ISO_NOW, updatedAt: ISO_NOW },
          createdAt: ISO_NOW,
          updatedAt: ISO_NOW,
        },
      ],
      total: 1,
      page: 2,
      pageSize: 10,
    });
  });

  it('upserts through the repository', async () => {
    const { service, repository } = setup();
    const data = { type: GroupType.USER, uuid: 'user', label: 'Ada' };

    await service.upsert(data);

    expect(repository.upsert).toHaveBeenCalledWith(data);
  });
});
