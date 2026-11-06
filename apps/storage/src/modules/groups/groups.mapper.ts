import type { GroupType } from '@tomato/constants';
import type { StorageGroup } from '@tomato/types';
import type { Group as GroupEntity } from '../../generated/prisma/client';

export function toStorageGroup(entity: GroupEntity): StorageGroup {
  return {
    id: entity.id,
    type: entity.type as GroupType,
    uuid: entity.uuid,
    folderId: entity.folderId,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
