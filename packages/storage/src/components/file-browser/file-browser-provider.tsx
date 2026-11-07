import type { AxiosInstance } from "axios";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createStorageApi, type StorageApi } from "../../storage.api";

export class FileBrowserProviderMissingError extends Error {
  constructor() {
    super("useStorageApi must be used inside <FileBrowserProvider>");
  }
}

const StorageApiContext = createContext<StorageApi | null>(null);

interface FileBrowserProviderProps {
  apiClient: AxiosInstance;
  path: string;
  children: ReactNode;
}

export function FileBrowserProvider({
  apiClient,
  path,
  children,
}: FileBrowserProviderProps) {
  const api = useMemo(
    () => createStorageApi(apiClient, path),
    [apiClient, path],
  );

  return (
    <StorageApiContext.Provider value={api}>
      {children}
    </StorageApiContext.Provider>
  );
}

export function useStorageApi(): StorageApi {
  const api = useContext(StorageApiContext);
  if (!api) throw new FileBrowserProviderMissingError();
  return api;
}
