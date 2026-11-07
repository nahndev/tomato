import { STORAGE_API_BASE_URL } from "./file.constants";

export function getFileContentUrl(fileId: string): string {
  return `${STORAGE_API_BASE_URL}/files/${fileId}/content`;
}
