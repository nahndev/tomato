import { Button, cn, Typography } from "@tomato/ui";
import { XIcon } from "lucide-react";
import { createElement } from "react";
import { UNAVAILABLE_FILE_KIND } from "../storage.constants";
import type { FileListLabels, StorageFile } from "../storage.types";
import { useStorageApi } from "./file-browser/file-browser-provider";
import { getFileKind } from "./file-browser/file-thumbnail";

interface StorageFileItemProps {
  file?: StorageFile;
  labels?: Partial<FileListLabels>;
  onRemove?: () => void;
  className?: string;
}

export function StorageFileItem({
  file,
  labels: customLabels,
  onRemove,
  className,
}: StorageFileItemProps) {
  const api = useStorageApi();
  const labels = { remove: "Remove", unavailable: "File not available", ...customLabels };
  const { icon, colorClassName } = file ? getFileKind(file.mimeType) : UNAVAILABLE_FILE_KIND;

  return (
    <div
      className={cn(
        "group/file flex h-10 items-center gap-3 rounded-md border border-border px-3 text-sm",
        file
          ? "bg-muted transition-colors hover:bg-card"
          : "border-dashed text-muted-foreground",
        className,
      )}
    >
      {createElement(icon, {
        "aria-hidden": true,
        className: cn("size-5 shrink-0", colorClassName),
      })}
      {file ? (
        <Typography
          as="a"
          href={api.getFileContentUrl(file.id)}
          download={file.name}
          title={file.name}
          className="focus-ring min-w-0 flex-1 truncate rounded-sm text-primary group-hover/file:text-foreground"
        >
          {file.name}
        </Typography>
      ) : (
        <Typography className="min-w-0 flex-1 truncate">{labels.unavailable}</Typography>
      )}
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`${labels.remove} ${file?.name ?? labels.unavailable}`}
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
}
