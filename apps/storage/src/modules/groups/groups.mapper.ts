import type { GroupType } from '@tomato/constants';
import type { StorageGroup } from '@tomato/types';
import { toStorageFolder } from '../folders/folders.mapper';
import type { GroupWithRootFolder } from './groups.types';

export function toStorageGroup(entity: GroupWithRootFolder): StorageGroup {
  return {
    id: entity.id,
    type: entity.type as GroupType,
    uuid: entity.uuid,
    label: entity.label,
    rootFolder: toStorageFolder(entity.folder),
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
