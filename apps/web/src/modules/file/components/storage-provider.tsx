"use client";

import { FileBrowserProvider } from "@tomato/storage-ui";
import type { ReactNode } from "react";
import { apiClient } from "@/shared/lib/api-client";
import { STORAGE_API_BASE_URL } from "../file.constants";

export function StorageProvider({ children }: { children: ReactNode }) {
  return (
    <FileBrowserProvider apiClient={apiClient} path={STORAGE_API_BASE_URL}>
      {children}
    </FileBrowserProvider>
  );
}
