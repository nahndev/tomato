import { formatBytes } from "@tomato/utils";
import type { Accept } from "react-dropzone";
import { FileBrowserItemType, ROOT_DROP_TARGET_ID } from "../storage.constants";
import type { FileBrowserItem, FileBrowserTreeNode, StorageFolderTree } from "../storage.types";

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

export function isFolder(item: FileBrowserItem) {
  return item.type === FileBrowserItemType.FOLDER;
}

/** Hides the root folder: its direct children get `parentId: null`. */
export function toBrowserItems(
  rootId: string,
  { folders, files }: StorageFolderTree,
): FileBrowserItem[] {
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
    ...files.map(({ id, name, folderId, size, mimeType, updatedAt }) => ({
      id,
      name,
      type: FileBrowserItemType.FILE,
      parentId: toParentId(folderId),
      size,
      mimeType,
      updatedAt,
    })),
  ];
}

export function formatFileDetails({
  size,
  updatedAt,
}: Pick<FileBrowserItem, "size" | "updatedAt">) {
  return [
    size === undefined ? null : formatBytes(size),
    updatedAt ? DATE_FORMAT.format(new Date(updatedAt)) : null,
  ]
    .filter(Boolean)
    .join(" · ");
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

/** The move a drop would make, or `null` when the drop must not move anything. */
export function findMove(
  items: FileBrowserItem[],
  sourceId: string | number,
  targetId: string | number,
) {
  const item = items.find(({ id }) => id === sourceId);
  const parentId = targetId === ROOT_DROP_TARGET_ID ? null : String(targetId);
  return item && canMoveTo(items, item, parentId) ? { item, parentId } : null;
}

function compareItems(first: FileBrowserItem, second: FileBrowserItem) {
  if (first.type !== second.type) return isFolder(first) ? -1 : 1;
  return first.name.localeCompare(second.name);
}

/** A search expands every folder holding a match. */
export function getTreeNodes(
  items: FileBrowserItem[],
  {
    accept,
    search,
    expandedIds,
  }: { accept?: Accept; search: string; expandedIds: ReadonlySet<string> },
): FileBrowserTreeNode[] {
  const normalizedSearch = search.trim().toLowerCase();
  const isSearching = normalizedSearch.length > 0;

  function collect(
    parentId: string | null,
    depth: number,
  ): FileBrowserTreeNode[] {
    return items
      .filter((item) => item.parentId === parentId)
      .sort(compareItems)
      .flatMap((item) => {
        const isNameMatch = item.name.toLowerCase().includes(normalizedSearch);
        if (!isFolder(item)) {
          return isNameMatch && matchesAccept(item, accept)
            ? [{ item, depth, isExpanded: false, isExpandable: false }]
            : [];
        }
        const children = collect(item.id, depth + 1);
        const hasChildren = children.length > 0;
        if (!isNameMatch && !hasChildren) return [];
        const isExpanded =
          hasChildren && (isSearching || expandedIds.has(item.id));
        return [
          {
            item,
            depth,
            isExpanded,
            isExpandable: hasChildren && !isSearching,
          },
          ...(isExpanded ? children : []),
        ];
      });
  }

  return collect(null, 0);
}
