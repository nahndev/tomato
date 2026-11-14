import type { StorageGroupLimit } from "./storage.types";

export const storageKeys = {
  groups: (limit?: StorageGroupLimit | null) =>
    ["storage", "groups", limit] as const,
  files: (ids: string[]) => ["storage", "files", ids] as const,
  folderTree: (folderId: string) =>
    ["storage", "folder-tree", folderId] as const,
};
