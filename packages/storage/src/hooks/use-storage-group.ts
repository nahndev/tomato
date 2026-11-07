import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StorageGroupNotFoundError, type StorageApi } from "../storage.api";
import { storageKeys } from "../storage.keys";
import type { FileBrowserItem, StorageGroupOwner } from "../storage.types";
import { isFolder, toBrowserItems } from "../utils/file-browser.utils";
import { useFileUploads } from "./use-file-uploads";

export function useStorageGroup(api: StorageApi, owner: StorageGroupOwner) {
  const queryClient = useQueryClient();
  const queryKey = storageKeys.group(owner);
  const {
    data: group,
    isLoading,
    isError,
    refetch,
  } = useQuery({ queryKey, queryFn: () => api.getGroup(owner) });
  const { uploads, uploadFiles, dismissUpload } = useFileUploads(api);
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
    refetch,
    uploads,
    dismissUpload,
    uploadFiles: (files: File[], parentId: string | null) =>
      runAction(() => uploadFiles(toFolderId(parentId), files)),
    createFolder: (name: string, parentId: string | null) =>
      runAction(() => api.createFolder(toFolderId(parentId), name)),
    rename: (item: FileBrowserItem, name: string) =>
      runAction(() =>
        isFolder(item)
          ? api.updateFolder(item.id, { name })
          : api.updateFile(item.id, { name }),
      ),
    move: (item: FileBrowserItem, parentId: string | null) =>
      runAction(() =>
        isFolder(item)
          ? api.updateFolder(item.id, { parentId: toFolderId(parentId) })
          : api.updateFile(item.id, { folderId: toFolderId(parentId) }),
      ),
    remove: (item: FileBrowserItem) =>
      runAction(() =>
        isFolder(item) ? api.deleteFolder(item.id) : api.deleteFile(item.id),
      ),
  };
}
