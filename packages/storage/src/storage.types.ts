import type { GroupType } from "@tomato/constants";
import type { Accept } from "react-dropzone";
import type { FileBrowserItemType } from "./storage.constants";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
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

export interface FileBrowserItem {
  id: string;
  name: string;
  type: FileBrowserItemType;
  /** `null` is the root folder of the group. */
  parentId: string | null;
  size?: number;
  mimeType?: string;
  updatedAt?: string;
}

export interface FileBrowserUpload {
  id: string;
  name: string;
  /** From 0 to 1. */
  progress: number;
  isFailed: boolean;
}

export interface FileBrowserTreeNode {
  item: FileBrowserItem;
  depth: number;
  isExpanded: boolean;
  isExpandable: boolean;
}

export interface FileBrowserOptions {
  /** Filters the listed files and the uploads by type. */
  accept?: Accept;
  maxSize?: number;
  /** Applies to selection only; uploads always allow several files. */
  multiple?: boolean;
}

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

export interface StorageFolderTree {
  folders: StorageFolder[];
  files: StorageFile[];
}

export interface StorageGroup {
  id: string;
  type: GroupType;
  uuid: string;
  label: string;
  /** The root folder of the group. */
  folderId: string;
  folder: StorageFolder;
  createdAt: string;
  updatedAt: string;
}
