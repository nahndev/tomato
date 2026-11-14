import {
  FileArchiveIcon,
  FileIcon,
  FileImageIcon,
  FileMusicIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoCameraIcon,
  FileXIcon,
} from "lucide-react";

export const FileBrowserItemType = {
  FILE: "file",
  FOLDER: "folder",
} as const;
export type FileBrowserItemType =
  (typeof FileBrowserItemType)[keyof typeof FileBrowserItemType];

export const GROUPS_PAGE_SIZE = 100;
export const FILES_CHUNK_SIZE = 100;
export const DROP_TARGET_CLASS = "bg-selected ring-2 ring-focus ring-inset";
export const ROOT_DROP_TARGET_ID = "file-browser-root";
export const DRAG_ACTIVATOR_ATTRIBUTE = "data-drag-activator";
export const DRAG_ACTIVATOR_PROPS = { [DRAG_ACTIVATOR_ATTRIBUTE]: "" };

export const FILE_KINDS = [
  { pattern: /^image\//, icon: FileImageIcon, colorClassName: "text-accent" },
  { pattern: /^video\//, icon: FileVideoCameraIcon, colorClassName: "text-warning" },
  { pattern: /^audio\//, icon: FileMusicIcon, colorClassName: "text-warning" },
  { pattern: /sheet|excel|csv/, icon: FileSpreadsheetIcon, colorClassName: "text-success" },
  { pattern: /zip|compressed|tar|rar/, icon: FileArchiveIcon, colorClassName: "text-warning" },
  { pattern: /pdf/, icon: FileTextIcon, colorClassName: "text-danger" },
  { pattern: /^text\/|document|msword/, icon: FileTextIcon, colorClassName: "text-info" },
];

export const DEFAULT_FILE_KIND = { icon: FileIcon, colorClassName: "text-muted-foreground" };

export const UNAVAILABLE_FILE_KIND = { icon: FileXIcon, colorClassName: "text-muted-foreground" };
