import type { GroupType } from "@tomato/constants";
import type { Accept } from "react-dropzone";
import type {
  DEFAULT_FILE_BROWSER_LABELS,
  FileBrowserItemType,
} from "./storage.constants";

/** Identifies a group by what it belongs to. */
export interface StorageGroupOwner {
  type: GroupType;
  uuid: string;
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

export type FileBrowserLabels = Record<
  keyof typeof DEFAULT_FILE_BROWSER_LABELS,
  string
>;

export interface FileBrowserOptions extends Partial<FileBrowserLabels> {
  /** Filters the listed files and the uploads by type. */
  accept?: Accept;
  maxSize?: number;
  /** Applies to selection only; uploads always allow several files. */
  multiple?: boolean;
  canCreateFolder?: boolean;
  isReadOnly?: boolean;
  defaultFolderId?: string | null;
}
