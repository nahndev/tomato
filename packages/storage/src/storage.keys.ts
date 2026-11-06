import type { StorageGroupOwner } from "./storage.types";

export const storageKeys = {
  group: ({ type, uuid }: StorageGroupOwner) =>
    ["storage", "groups", type, uuid] as const,
};
