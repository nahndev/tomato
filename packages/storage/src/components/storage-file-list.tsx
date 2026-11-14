import { Button, Skeleton, cn } from "@tomato/ui";
import { FileXIcon, RotateCwIcon, XIcon } from "lucide-react";
import { useStorageFiles } from "../hooks/use-storage-files";
import { DEFAULT_FILE_LIST_LABELS } from "../storage.constants";
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
  const labels = { ...DEFAULT_FILE_LIST_LABELS, ...customLabels };
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
        {labels.loadFailed}
        <Button type="button" variant="outline" size="xs" onClick={() => void refetch()}>
          <RotateCwIcon />
          {labels.retry}
        </Button>
      </div>
    );
  }

  return (
    <ul aria-busy={isLoading} className={cn("flex flex-col gap-1.5", className)}>
      {ids.map((id) => {
        const file = filesById.get(id);
        const handleRemove = onRemove && (() => onRemove(id));
        return (
          <li key={id}>
            {file ? (
              <StorageFileItem file={file} removeLabel={labels.remove} onRemove={handleRemove} />
            ) : isLoading ? (
              <Skeleton aria-label={labels.loading} className="h-10" />
            ) : (
              <div className="flex h-10 items-center gap-3 rounded-md border border-dashed border-border px-3 text-sm text-muted-foreground">
                <FileXIcon aria-hidden className="size-5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{labels.unavailable}</span>
                {handleRemove && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`${labels.remove} ${labels.unavailable}`}
                    onClick={handleRemove}
                  >
                    <XIcon />
                  </Button>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
