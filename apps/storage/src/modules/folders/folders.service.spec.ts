import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import type { Folder as FolderEntity } from '../../generated/prisma/client';
import type { FilesService } from '../files/files.service';
import type { FolderTreeRepository } from '../folder-tree/folder-tree.repository';
import type { FoldersRepository } from './folders.repository';
import { FoldersService } from './folders.service';

const ROOT_ID = 'root';
const OTHER_ROOT_ID = 'other-root';
const PARENT: Record<string, string | null> = {
  [ROOT_ID]: null,
  a: ROOT_ID,
  'a-child': 'a',
  b: ROOT_ID,
  [OTHER_ROOT_ID]: null,
  c: OTHER_ROOT_ID,
};

function makeEntity(id: string): FolderEntity {
  const now = new Date();
  return { id, name: id, parentId: PARENT[id] ?? null, createdAt: now, updatedAt: now };
}

function pathToRoot(id: string): string[] {
  if (!(id in PARENT)) return [];
  const parentId = PARENT[id];
  return parentId ? [id, ...pathToRoot(parentId)] : [id];
}

function setup() {
  const repository = {
    findById: vi.fn(async (id: string) => (id in PARENT ? makeEntity(id) : null)),
    update: vi.fn(async (id: string, data: Partial<FolderEntity>) => ({ ...makeEntity(id), ...data })),
    delete: vi.fn(async () => true),
    withMoveLock: vi.fn(async <T>(action: () => Promise<T>) => action()),
  };
  const folderTree = {
    findPathToRoot: vi.fn(async (id: string) => pathToRoot(id)),
    findSubtreeIds: vi.fn(async (id: string) => [id, 'a-child']),
  };
  const filesService = {
    findObjectIds: vi.fn(async () => ['key']),
    removeContents: vi.fn(async () => undefined),
  };
  const service = new FoldersService(
    repository as unknown as FoldersRepository,
    folderTree as unknown as FolderTreeRepository,
    filesService as unknown as FilesService,
  );
  return { service, repository, filesService };
}

describe('FoldersService', () => {
  it('moves a folder inside its group under the move lock', async () => {
    const { service, repository } = setup();

    const folder = await service.update('a', { parentId: 'b' });

    expect(folder.parentId).toBe('b');
    expect(repository.withMoveLock).toHaveBeenCalledOnce();
  });

  it('rejects moving a folder into itself or a descendant', async () => {
    const { service, repository } = setup();

    await expect(service.update('a', { parentId: 'a' })).rejects.toThrow(ConflictException);
    await expect(service.update('a', { parentId: 'a-child' })).rejects.toThrow(ConflictException);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('rejects moving a folder to another group', async () => {
    const { service } = setup();

    await expect(service.update('a', { parentId: 'c' })).rejects.toThrow(ConflictException);
  });

  it('returns not found for a missing target', async () => {
    const { service } = setup();

    await expect(service.update('a', { parentId: 'missing' })).rejects.toThrow(NotFoundException);
  });

  it('protects the root folder', async () => {
    const { service, repository } = setup();

    await expect(service.update(ROOT_ID, { name: 'x' })).rejects.toThrow(ConflictException);
    await expect(service.remove(ROOT_ID)).rejects.toThrow(ConflictException);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('deletes file contents after the folder rows', async () => {
    const { service, repository, filesService } = setup();

    await service.remove('a');

    expect(filesService.findObjectIds).toHaveBeenCalledWith(['a', 'a-child']);
    expect(filesService.removeContents).toHaveBeenCalledWith(['key']);
    expect(repository.delete.mock.invocationCallOrder[0]).toBeLessThan(
      filesService.removeContents.mock.invocationCallOrder[0] as number,
    );
  });
});
