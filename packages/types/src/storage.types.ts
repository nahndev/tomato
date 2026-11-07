import type { GroupType } from '@tomato/constants';

export interface StorageFolder {
  id: string;
  /** `null` only for the root folder of a group. */
  parentId: string | null;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorageFile {
  id: string;
  folderId: string;
  name: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface StorageFolderDetail extends StorageFolder {
  folders: StorageFolder[];
  files: StorageFile[];
}

export interface StorageFolderTree {
  folders: StorageFolder[];
  files: StorageFile[];
}

export interface StorageGroup {
  id: string;
  type: GroupType;
  uuid: string;
  label: string;
  rootFolder: StorageFolder;
  createdAt: string;
  updatedAt: string;
}

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
