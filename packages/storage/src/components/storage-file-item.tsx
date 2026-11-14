import { Button, cn } from "@tomato/ui";
import { XIcon } from "lucide-react";
import { createElement } from "react";
import { DEFAULT_FILE_LIST_LABELS } from "../storage.constants";
import type { StorageFile } from "../storage.types";
import { useStorageApi } from "./file-browser/file-browser-provider";
import { getFileKind } from "./file-browser/file-thumbnail";

interface StorageFileItemProps {
  file: StorageFile;
  removeLabel?: string;
  onRemove?: () => void;
  className?: string;
}

export function StorageFileItem({
  file,
  removeLabel = DEFAULT_FILE_LIST_LABELS.remove,
  onRemove,
  className,
}: StorageFileItemProps) {
  const api = useStorageApi();
  const src = api.getFileContentUrl(file.id);
  const { icon, colorClassName } = getFileKind(file.mimeType);

  return (
    <div
      className={cn(
        "group/file flex h-10 items-center gap-3 rounded-md border border-border bg-muted px-3 text-sm transition-colors hover:bg-card",
        className,
      )}
    >
      {createElement(icon, {
        "aria-hidden": true,
        className: cn("size-5 shrink-0", colorClassName),
      })}
      <a
        href={src}
        download={file.name}
        title={file.name}
        className="focus-ring min-w-0 flex-1 truncate rounded-sm text-primary group-hover/file:text-foreground"
      >
        {file.name}
      </a>
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`${removeLabel} ${file.name}`}
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
}
