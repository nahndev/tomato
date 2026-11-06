import type { StorageFolder } from '@tomato/types';
import type { Folder as FolderEntity } from '../../generated/prisma/client';

export function toStorageFolder(entity: FolderEntity): StorageFolder {
  return {
    id: entity.id,
    parentId: entity.parentId,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
