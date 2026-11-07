import type { StorageGroupOwner } from "./storage.types";

export const storageKeys = {
  groups: (owners: StorageGroupOwner[]) =>
    ["storage", "groups", owners] as const,
  folderTree: (folderId: string) =>
    ["storage", "folder-tree", folderId] as const,
};
