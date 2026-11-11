import type { GroupType } from '@tomato/constants';
import type { Folder as FolderEntity, Group as GroupEntity } from '../../generated/prisma/client';

export type StorageFieldFilter<T extends string> =
  | T
  | { equals?: T; in?: T[]; notIn?: T[]; not?: T };

/** The subset of Prisma's `GroupWhereInput` accepted by `GET /groups`. */
export interface StorageGroupLimit {
  type?: StorageFieldFilter<GroupType>;
  uuid?: StorageFieldFilter<string>;
  AND?: StorageGroupLimit | StorageGroupLimit[];
  OR?: StorageGroupLimit[];
  NOT?: StorageGroupLimit | StorageGroupLimit[];
}

export type GroupWithRootFolder = GroupEntity & { folder: FolderEntity };
