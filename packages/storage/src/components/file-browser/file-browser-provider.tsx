import type { AxiosInstance } from "axios";
import { createStoreContext } from "@tomato/store-context";
import { useMemo, type ReactNode } from "react";
import { createStorageApi, type StorageApi } from "../../storage.api";

const FileBrowserStore = createStoreContext<{ api: StorageApi }>("FileBrowser");

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
    <FileBrowserStore.Provider api={api}>{children}</FileBrowserStore.Provider>
  );
}

export function useStorageApi(): StorageApi {
  return FileBrowserStore.useSelector((state) => state.api);
}
