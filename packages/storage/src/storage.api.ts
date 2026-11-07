import type {
  PaginatedResponse,
  StorageFile,
  StorageFolder,
  StorageFolderTree,
  StorageGroup,
} from "@tomato/types";
import type { AxiosInstance } from "axios";
import type { StorageGroupOwner } from "./storage.types";

export type StorageApi = ReturnType<typeof createStorageApi>;

export function createStorageApi(client: AxiosInstance, baseURL: string) {
  return {
    async listGroups({
      type,
      uuid,
    }: StorageGroupOwner): Promise<StorageGroup[]> {
      const { data } = await client.get<PaginatedResponse<StorageGroup>>(
        "/groups",
        { baseURL, params: { type, uuid } },
      );
      return data.items;
    },

    async getFolderTree(id: string): Promise<StorageFolderTree> {
      const { data } = await client.get<StorageFolderTree>(
        `/folders/${id}/tree`,
        { baseURL },
      );
      return data;
    },

    async createFolder(parentId: string, name: string): Promise<StorageFolder> {
      const { data } = await client.post<StorageFolder>(
        "/folders",
        { parentId, name },
        { baseURL },
      );
      return data;
    },

    async updateFolder(
      id: string,
      input: { name?: string; parentId?: string },
    ): Promise<StorageFolder> {
      const { data } = await client.patch<StorageFolder>(
        `/folders/${id}`,
        input,
        { baseURL },
      );
      return data;
    },

    async deleteFolder(id: string): Promise<void> {
      await client.delete(`/folders/${id}`, { baseURL });
    },

    async uploadFile(
      folderId: string,
      file: File,
      onProgress?: (progress: number) => void,
    ): Promise<StorageFile> {
      const body = new FormData();
      body.append("folderId", folderId);
      body.append("file", file);
      const { data } = await client.post<StorageFile>("/files", body, {
        baseURL,
        onUploadProgress: ({ progress }) => {
          if (progress !== undefined) onProgress?.(progress);
        },
      });
      return data;
    },

    async updateFile(
      id: string,
      input: { name?: string; folderId?: string },
    ): Promise<StorageFile> {
      const { data } = await client.patch<StorageFile>(`/files/${id}`, input, {
        baseURL,
      });
      return data;
    },

    async deleteFile(id: string): Promise<void> {
      await client.delete(`/files/${id}`, { baseURL });
    },

    getFileContentUrl(id: string): string {
      return client.getUri({ baseURL, url: `/files/${id}/content` });
    },
  };
}
