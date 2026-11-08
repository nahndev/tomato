import { STORAGE_API_BASE_URL } from "./file.constants";

export function getFileContentUrl(fileId: string): string {
  return `${STORAGE_API_BASE_URL}/files/${fileId}/content`;
}

export function getFileIdFromContentUrl(url: string): string | null {
  const prefix = `${STORAGE_API_BASE_URL}/files/`;
  const suffix = "/content";
  if (!url.startsWith(prefix) || !url.endsWith(suffix)) return null;
  const fileId = url.slice(prefix.length, -suffix.length);
  return fileId && !fileId.includes("/") ? decodeURIComponent(fileId) : null;
}
