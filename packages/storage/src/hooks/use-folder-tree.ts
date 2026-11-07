import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStorageApi } from "../components/file-browser/file-browser-provider";
import { storageKeys } from "../storage.keys";
import type { FileBrowserItem } from "../storage.types";
import { isFolder, toBrowserItems } from "../utils/file-browser.utils";
import { useFileUploads } from "./use-file-uploads";

export function useFolderTree(rootFolderId: string) {
  const api = useStorageApi();
  const queryClient = useQueryClient();
  const queryKey = storageKeys.folderTree(rootFolderId);
  const {
    data: tree,
    isLoading,
    isError,
    refetch,
  } = useQuery({ queryKey, queryFn: () => api.getFolderTree(rootFolderId) });
  const { uploads, uploadFiles, dismissUpload } = useFileUploads();

  const toFolderId = (parentId: string | null) => parentId ?? rootFolderId;

  const { mutateAsync: runAction } = useMutation({
    mutationFn: (action: () => Promise<unknown>) => action(),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    tree,
    items: tree ? toBrowserItems(rootFolderId, tree) : [],
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
