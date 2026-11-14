import type { PaginatedResponse, StorageGroupLimit } from "./storage.types";
import type { AxiosInstance } from "axios";
import { FILES_CHUNK_SIZE, GROUPS_PAGE_SIZE } from "./storage.constants";
import type { StorageFile, StorageFolder, StorageFolderTree, StorageGroup } from "./storage.types";

export type StorageApi = ReturnType<typeof createStorageApi>;

export function createStorageApi(client: AxiosInstance, baseURL: string) {
  return {
    async listGroups(limit?: StorageGroupLimit | null): Promise<StorageGroup[]> {
      const groups: StorageGroup[] = [];
      for (let page = 1; ; page += 1) {
        const { data } = await client.get<PaginatedResponse<StorageGroup>>(
          "/groups",
          {
            baseURL,
            params: {
              limit: limit ? JSON.stringify(limit) : undefined,
              page,
              pageSize: GROUPS_PAGE_SIZE,
            },
          },
        );
        groups.push(...data.items);
        if (data.items.length === 0 || groups.length >= data.total) {
          return groups;
        }
      }
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

    async listFiles(ids: string[]): Promise<StorageFile[]> {
      const chunks: string[][] = [];
      for (let start = 0; start < ids.length; start += FILES_CHUNK_SIZE) {
        chunks.push(ids.slice(start, start + FILES_CHUNK_SIZE));
      }
      const responses = await Promise.all(
        chunks.map((chunk) =>
          client.get<StorageFile[]>("/files", {
            baseURL,
            params: { ids: chunk.join(",") },
          }),
        ),
      );
      return responses.flatMap(({ data }) => data);
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
