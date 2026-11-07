import { generateId } from "@tomato/utils";
import { useState } from "react";
import { useStorageApi } from "../components/file-browser/file-browser-provider";
import type { FileBrowserUpload } from "../storage.types";

export function useFileUploads() {
  const api = useStorageApi();
  const [uploads, setUploads] = useState<FileBrowserUpload[]>([]);

  function patchUpload(id: string, patch: Partial<FileBrowserUpload>) {
    setUploads((current) =>
      current.map((upload) =>
        upload.id === id ? { ...upload, ...patch } : upload,
      ),
    );
  }

  function dismissUpload(id: string) {
    setUploads((current) => current.filter((upload) => upload.id !== id));
  }

  /** Never rejects: a failed file stays listed until it is dismissed. */
  async function uploadFiles(folderId: string, files: File[]) {
    const batch = files.map((file) => ({ id: generateId(), file }));
    setUploads((current) => [
      ...current.filter(({ isFailed }) => !isFailed),
      ...batch.map(({ id, file }) => ({
        id,
        name: file.name,
        progress: 0,
        isFailed: false,
      })),
    ]);
    await Promise.all(
      batch.map(async ({ id, file }) => {
        try {
          await api.uploadFile(folderId, file, (progress) =>
            patchUpload(id, { progress }),
          );
          dismissUpload(id);
        } catch {
          patchUpload(id, { isFailed: true });
        }
      }),
    );
  }

  return { uploads, uploadFiles, dismissUpload };
}
