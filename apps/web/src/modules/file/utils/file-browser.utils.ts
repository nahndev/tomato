import type { StorageGroupDetail } from "@tomato/types";
import type { Accept } from "react-dropzone";
import { FileBrowserItemType } from "../file.constants";
import type { FileBrowserItem } from "../file.types";

export function isFolder(item: FileBrowserItem) {
  return item.type === FileBrowserItemType.FOLDER;
}

/** Hides the root folder: its direct children get `parentId: null`. */
export function toBrowserItems({
  folderId: rootId,
  folders,
  files,
}: StorageGroupDetail): FileBrowserItem[] {
  const toParentId = (id: string | null) => (id === rootId ? null : id);
  return [
    ...folders
      .filter(({ id }) => id !== rootId)
      .map(({ id, name, parentId }) => ({
        id,
        name,
        type: FileBrowserItemType.FOLDER,
        parentId: toParentId(parentId),
      })),
    ...files.map(({ id, name, folderId, size, mimeType }) => ({
      id,
      name,
      type: FileBrowserItemType.FILE,
      parentId: toParentId(folderId),
      size,
      mimeType,
    })),
  ];
}

export function matchesAccept(item: FileBrowserItem, accept?: Accept) {
  if (!accept) return true;
  const name = item.name.toLowerCase();
  const mimeType = item.mimeType?.toLowerCase();
  return Object.entries(accept).some(([acceptedType, extensions]) => {
    const isTypeMatch = acceptedType.endsWith("/*")
      ? mimeType?.startsWith(acceptedType.slice(0, -1))
      : mimeType === acceptedType.toLowerCase();
    return (
      isTypeMatch ||
      [extensions]
        .flat()
        .some((extension) => name.endsWith(extension.toLowerCase()))
    );
  });
}

export function getFolderPath(
  items: FileBrowserItem[],
  folderId: string | null,
) {
  const path: FileBrowserItem[] = [];
  const visitedIds = new Set<string>();
  let currentId = folderId;
  while (currentId && !visitedIds.has(currentId)) {
    visitedIds.add(currentId);
    const folder = items.find((item) => item.id === currentId);
    if (!folder) break;
    path.unshift(folder);
    currentId = folder.parentId;
  }
  return path;
}

export function canMoveTo(
  items: FileBrowserItem[],
  item: FileBrowserItem,
  targetId: string | null,
) {
  if (item.parentId === targetId) return false;
  return !getFolderPath(items, targetId).some(({ id }) => id === item.id);
}

export function compareItems(first: FileBrowserItem, second: FileBrowserItem) {
  if (first.type !== second.type) return isFolder(first) ? -1 : 1;
  return first.name.localeCompare(second.name);
}
