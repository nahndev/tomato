import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useStorageApi } from "../components/file-browser/file-browser-provider";
import { storageKeys } from "../storage.keys";

export function useStorageFiles(ids: string[]) {
  const api = useStorageApi();
  const { data, isPending, isPlaceholderData, isError, refetch } = useQuery({
    queryKey: storageKeys.files(ids),
    queryFn: () => api.listFiles(ids),
    enabled: ids.length > 0,
    placeholderData: keepPreviousData,
  });

  return {
    filesById: new Map(data?.map((file) => [file.id, file])),
    isLoading: isPending || isPlaceholderData,
    isError,
    refetch,
  };
}
