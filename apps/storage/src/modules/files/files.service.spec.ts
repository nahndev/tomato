import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import type { File } from '../../generated/prisma/client';
import type { FolderTreeRepository } from '../folder-tree/folder-tree.repository';
import type { FilesRepository } from './files.repository';
import { FilesService } from './files.service';
import type { FilesStorage } from './files.storage';

const UPLOAD = { buffer: Buffer.from('x'), originalname: 'a.png', mimetype: 'image/png', size: 1 };

function makeEntity(data: Partial<File> = {}): File {
  const now = new Date();
  return {
    id: 'file',
    folderId: 'folder',
    name: 'a.png',
    mimeType: 'image/png',
    size: 1n,
    objectId: 'key',
    createdAt: now,
    updatedAt: now,
    ...data,
  };
}

function setup() {
  const repository = {
    findById: vi.fn(async (): Promise<File | null> => makeEntity()),
    findByIds: vi.fn(async (): Promise<File[]> => [makeEntity()]),
    findStoredById: vi.fn(async (): Promise<File | null> => makeEntity()),
    create: vi.fn(async (): Promise<File | null> => makeEntity()),
    update: vi.fn(async (_id: string, data: Partial<File>): Promise<File | null> => makeEntity(data)),
    delete: vi.fn(async (): Promise<File | null> => makeEntity()),
  };
  const storage = {
    save: vi.fn(async () => 'key'),
    read: vi.fn(async (): Promise<Buffer | null> => Buffer.from('x')),
    remove: vi.fn(async () => undefined),
  };
  const folderTree = {
    findPathToRoot: vi.fn(async (id: string): Promise<string[]> => {
      if (id === 'missing') return [];
      return id === 'other-group' ? [id, 'other-root'] : [id, 'root'];
    }),
  };
  const service = new FilesService(
    repository as unknown as FilesRepository,
    storage as unknown as FilesStorage,
    folderTree as unknown as FolderTreeRepository,
  );
  return { service, repository, storage };
}

describe('FilesService', () => {
  it('lists files by id, without a query for no ids', async () => {
    const { service, repository } = setup();

    await expect(service.list(['file'])).resolves.toHaveLength(1);
    await expect(service.list([])).resolves.toEqual([]);
    expect(repository.findByIds).toHaveBeenCalledTimes(1);
    expect(repository.findByIds).toHaveBeenCalledWith(['file']);
  });

  it('rejects a missing upload or an invalid name without saving', async () => {
    const { service, storage } = setup();

    await expect(service.create('folder')).rejects.toThrow(BadRequestException);
    await expect(service.create('folder', { ...UPLOAD, originalname: ' ' })).rejects.toThrow(BadRequestException);
    expect(storage.save).not.toHaveBeenCalled();
  });

  it('removes the saved content when the folder does not exist', async () => {
    const { service, repository, storage } = setup();
    repository.create.mockResolvedValue(null);

    await expect(service.create('folder', UPLOAD)).rejects.toThrow(NotFoundException);
    expect(storage.remove).toHaveBeenCalledWith(['key']);
  });

  it('only moves a file inside its group', async () => {
    const { service, repository } = setup();

    await expect(service.update('file', { folderId: 'other-group' })).rejects.toThrow(ConflictException);
    await expect(service.update('file', { folderId: 'missing' })).rejects.toThrow(NotFoundException);
    expect(repository.update).not.toHaveBeenCalled();

    await expect(service.update('file', { folderId: 'target' })).resolves.toMatchObject({ folderId: 'target' });
  });

  it('deletes the content with the file', async () => {
    const { service, storage } = setup();

    await service.remove('file');

    expect(storage.remove).toHaveBeenCalledWith(['key']);
  });

  it('returns not found when the content is gone', async () => {
    const { service, storage } = setup();
    storage.read.mockResolvedValue(null);

    await expect(service.getContent('file')).rejects.toThrow(NotFoundException);
  });
});
