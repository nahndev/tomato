import type { StorageFile } from "@tomato/types";
import { Button, Spinner } from "@tomato/ui";
import type { FileBrowserLabels } from "../../storage.types";
import { formatFileDetails } from "../../utils/file-browser.utils";
import { useStorageApi } from "./file-browser-provider";
import { FileThumbnail } from "./file-thumbnail";

interface SelectionBarProps {
  files: StorageFile[];
  labels: FileBrowserLabels;
  isSubmitting: boolean;
  onClear: () => void;
  onSubmit: () => void;
}

export function SelectionBar({
  files,
  labels,
  isSubmitting,
  onClear,
  onSubmit,
}: SelectionBarProps) {
  const api = useStorageApi();
  const [firstFile] = files;

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-3 gap-y-2 border-t border-border p-3">
      <div
        aria-live="polite"
        className="flex min-w-0 basis-full items-center gap-2 @xl:flex-1 @xl:basis-0"
      >
        {files.length === 1 && firstFile ? (
          <>
            <FileThumbnail
              className="size-10"
              mimeType={firstFile.mimeType}
              src={api.getFileContentUrl(firstFile.id)}
            />
            <div className="min-w-0 text-sm">
              <p title={firstFile.name} className="truncate font-medium">
                {firstFile.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {formatFileDetails(firstFile)}
              </p>
            </div>
          </>
        ) : (
          <p className="truncate text-sm text-muted-foreground">
            {files.length === 0
              ? labels.noSelection
              : labels.selectedCount.replace("{count}", String(files.length))}
          </p>
        )}
      </div>
      {files.length > 0 && (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          {labels.clearSelection}
        </Button>
      )}
      <Button
        type="button"
        disabled={files.length === 0 || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting && <Spinner className="size-4 text-current" />}
        {labels.submit}
      </Button>
    </div>
  );
}
