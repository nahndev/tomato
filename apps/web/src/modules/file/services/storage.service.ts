import type {
  PaginatedResponse,
  StorageFile,
  StorageFolder,
  StorageGroup,
  StorageGroupDetail,
} from "@tomato/types";
import { storageClient } from "@/shared/lib/api-client";
import type { StorageGroupOwner } from "../file.types";

export class StorageGroupNotFoundError extends Error {}

export async function getStorageGroup({
  type,
  uuid,
}: StorageGroupOwner): Promise<StorageGroupDetail> {
  const { data } = await storageClient.get<PaginatedResponse<StorageGroup>>(
    "/groups",
    { params: { type, uuid } },
  );
  const [group] = data.items;
  if (!group) throw new StorageGroupNotFoundError();
  const { data: detail } = await storageClient.get<StorageGroupDetail>(
    `/groups/${group.id}`,
  );
  return detail;
}

export async function createStorageFolder(
  parentId: string,
  name: string,
): Promise<StorageFolder> {
  const { data } = await storageClient.post<StorageFolder>("/folders", {
    parentId,
    name,
  });
  return data;
}

export async function updateStorageFolder(
  id: string,
  input: { name?: string; parentId?: string },
): Promise<StorageFolder> {
  const { data } = await storageClient.patch<StorageFolder>(
    `/folders/${id}`,
    input,
  );
  return data;
}

export async function deleteStorageFolder(id: string): Promise<void> {
  await storageClient.delete(`/folders/${id}`);
}

export async function uploadStorageFile(
  folderId: string,
  file: File,
): Promise<StorageFile> {
  const body = new FormData();
  body.append("folderId", folderId);
  body.append("file", file);
  const { data } = await storageClient.post<StorageFile>("/files", body);
  return data;
}

export async function updateStorageFile(
  id: string,
  input: { name?: string; folderId?: string },
): Promise<StorageFile> {
  const { data } = await storageClient.patch<StorageFile>(
    `/files/${id}`,
    input,
  );
  return data;
}

export async function deleteStorageFile(id: string): Promise<void> {
  await storageClient.delete(`/files/${id}`);
}

export async function downloadStorageFile({
  id,
  name,
  mimeType,
}: StorageFile): Promise<File> {
  const { data } = await storageClient.get<Blob>(`/files/${id}/content`, {
    responseType: "blob",
  });
  return new File([data], name, { type: mimeType });
}
