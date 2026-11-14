import { Button, Skeleton, Typography, cn } from "@tomato/ui";
import { RotateCwIcon } from "lucide-react";
import { useStorageFiles } from "../hooks/use-storage-files";
import type { FileListLabels } from "../storage.types";
import { StorageFileItem } from "./storage-file-item";

interface StorageFileListProps {
  ids: string[];
  labels?: Partial<FileListLabels>;
  onRemove?: (id: string) => void;
  className?: string;
}

export function StorageFileList({
  ids,
  labels: customLabels,
  onRemove,
  className,
}: StorageFileListProps) {
  const labels = {
    loading: "Loading files",
    loadFailed: "Could not load the files",
    retry: "Try again",
    ...customLabels,
  };
  const { filesById, isLoading, isError, refetch } = useStorageFiles(ids);

  if (ids.length === 0) return null;

  if (isError) {
    return (
      <div
        role="alert"
        className={cn(
          "flex items-center justify-between gap-2 rounded-md border border-input px-2 py-1.5 text-sm text-muted-foreground",
          className,
        )}
      >
        <Typography>{labels.loadFailed}</Typography>
        <Button type="button" variant="outline" size="xs" onClick={() => void refetch()}>
          <RotateCwIcon />
          <Typography>{labels.retry}</Typography>
        </Button>
      </div>
    );
  }

  return (
    <ul aria-busy={isLoading} className={cn("flex flex-col gap-1.5", className)}>
      {ids.map((id) => {
        const file = filesById.get(id);
        return (
          <li key={id}>
            {file || !isLoading ? (
              <StorageFileItem file={file} labels={customLabels} onRemove={onRemove && (() => onRemove(id))} />
            ) : (
              <Skeleton aria-label={labels.loading} className="h-10" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
