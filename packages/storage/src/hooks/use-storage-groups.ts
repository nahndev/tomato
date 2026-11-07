import { useQuery } from "@tanstack/react-query";
import { useStorageApi } from "../components/file-browser/file-browser-provider";
import { storageKeys } from "../storage.keys";
import type { StorageGroupOwner } from "../storage.types";

export function useStorageGroups(owners: StorageGroupOwner[]) {
  const api = useStorageApi();
  return useQuery({
    queryKey: storageKeys.groups(owners),
    queryFn: async () => {
      const groups = await Promise.all(
        owners.map((owner) => api.listGroups(owner)),
      );
      return groups.flat();
    },
  });
}
