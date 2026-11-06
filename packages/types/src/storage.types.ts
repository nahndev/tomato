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

export interface StorageGroup {
  id: string;
  type: GroupType;
  uuid: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
}

/** Holds every folder (the root included) and file of the group. */
export interface StorageGroupDetail extends StorageGroup {
  folders: StorageFolder[];
  files: StorageFile[];
}
