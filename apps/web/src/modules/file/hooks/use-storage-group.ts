"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fileKeys } from "../file.keys";
import type { FileBrowserItem, StorageGroupOwner } from "../file.types";
import {
  createStorageFolder,
  deleteStorageFile,
  deleteStorageFolder,
  getStorageGroup,
  StorageGroupNotFoundError,
  updateStorageFile,
  updateStorageFolder,
  uploadStorageFile,
} from "../services/storage.service";
import { isFolder, toBrowserItems } from "../utils/file-browser.utils";

async function uploadAll(folderId: string, files: File[]) {
  const results = await Promise.allSettled(
    files.map((file) => uploadStorageFile(folderId, file)),
  );
  const failure = results.find((result) => result.status === "rejected");
  if (failure) throw failure.reason;
}

export function useStorageGroup(owner: StorageGroupOwner) {
  const queryClient = useQueryClient();
  const queryKey = fileKeys.group(owner);
  const {
    data: group,
    isLoading,
    isError,
  } = useQuery({ queryKey, queryFn: () => getStorageGroup(owner) });
  const rootFolderId = group?.folderId;

  function toFolderId(parentId: string | null) {
    const folderId = parentId ?? rootFolderId;
    if (!folderId) throw new StorageGroupNotFoundError();
    return folderId;
  }

  const { mutateAsync: runAction } = useMutation({
    mutationFn: (action: () => Promise<unknown>) => action(),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    group,
    items: group ? toBrowserItems(group) : [],
    isLoading,
    isError,
    uploadFiles: (files: File[], parentId: string | null) =>
      runAction(() => uploadAll(toFolderId(parentId), files)),
    createFolder: (name: string, parentId: string | null) =>
      runAction(() => createStorageFolder(toFolderId(parentId), name)),
    rename: (item: FileBrowserItem, name: string) =>
      runAction(() =>
        isFolder(item)
          ? updateStorageFolder(item.id, { name })
          : updateStorageFile(item.id, { name }),
      ),
    move: (item: FileBrowserItem, parentId: string | null) =>
      runAction(() =>
        isFolder(item)
          ? updateStorageFolder(item.id, { parentId: toFolderId(parentId) })
          : updateStorageFile(item.id, { folderId: toFolderId(parentId) }),
      ),
    remove: (item: FileBrowserItem) =>
      runAction(() =>
        isFolder(item)
          ? deleteStorageFolder(item.id)
          : deleteStorageFile(item.id),
      ),
  };
}
