import type { StorageFile } from '@tomato/types';
import type { File as FileEntity } from '../../generated/prisma/client';

export function toStorageFile(entity: FileEntity): StorageFile {
  return {
    id: entity.id,
    folderId: entity.folderId,
    name: entity.name,
    mimeType: entity.mimeType,
    size: Number(entity.size),
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
