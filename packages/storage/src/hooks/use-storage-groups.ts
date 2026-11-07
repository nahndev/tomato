import { useQuery } from "@tanstack/react-query";
import type { StorageGroupLimit } from "@tomato/types";
import { useStorageApi } from "../components/file-browser/file-browser-provider";
import { storageKeys } from "../storage.keys";

export function useStorageGroups(limit?: StorageGroupLimit | null) {
  const api = useStorageApi();
  return useQuery({
    queryKey: storageKeys.groups(limit),
    queryFn: () => api.listGroups(limit),
  });
}
