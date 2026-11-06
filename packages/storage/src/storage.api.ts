import type {
  PaginatedResponse,
  StorageFile,
  StorageFolder,
  StorageGroup,
  StorageGroupDetail,
} from "@tomato/types";
import type { AxiosInstance } from "axios";
import type { StorageGroupOwner } from "./storage.types";

export class StorageGroupNotFoundError extends Error {}

export type StorageApi = ReturnType<typeof createStorageApi>;

export function createStorageApi(client: AxiosInstance) {
  return {
    async getGroup({
      type,
      uuid,
    }: StorageGroupOwner): Promise<StorageGroupDetail> {
      const { data } = await client.get<PaginatedResponse<StorageGroup>>(
        "/groups",
        { params: { type, uuid } },
      );
      const [group] = data.items;
      if (!group) throw new StorageGroupNotFoundError();
      const { data: detail } = await client.get<StorageGroupDetail>(
        `/groups/${group.id}`,
      );
      return detail;
    },

    async createFolder(parentId: string, name: string): Promise<StorageFolder> {
      const { data } = await client.post<StorageFolder>("/folders", {
        parentId,
        name,
      });
      return data;
    },

    async updateFolder(
      id: string,
      input: { name?: string; parentId?: string },
    ): Promise<StorageFolder> {
      const { data } = await client.patch<StorageFolder>(
        `/folders/${id}`,
        input,
      );
      return data;
    },

    async deleteFolder(id: string): Promise<void> {
      await client.delete(`/folders/${id}`);
    },

    async uploadFile(folderId: string, file: File): Promise<StorageFile> {
      const body = new FormData();
      body.append("folderId", folderId);
      body.append("file", file);
      const { data } = await client.post<StorageFile>("/files", body);
      return data;
    },

    async updateFile(
      id: string,
      input: { name?: string; folderId?: string },
    ): Promise<StorageFile> {
      const { data } = await client.patch<StorageFile>(`/files/${id}`, input);
      return data;
    },

    async deleteFile(id: string): Promise<void> {
      await client.delete(`/files/${id}`);
    },

    async downloadFile({ id, name, mimeType }: StorageFile): Promise<File> {
      const { data } = await client.get<Blob>(`/files/${id}/content`, {
        responseType: "blob",
      });
      return new File([data], name, { type: mimeType });
    },
  };
}
