import type { StorageGroupOwner } from "./file.types";

export const fileKeys = {
  group: ({ type, uuid }: StorageGroupOwner) =>
    ["storage", "groups", type, uuid] as const,
};
