import { Button, cn, Typography } from "@tomato/ui";
import { XIcon } from "lucide-react";
import { createElement } from "react";
import { UNAVAILABLE_FILE_KIND } from "../storage.constants";
import type { StorageFile } from "../storage.types";
import { useStorageApi } from "./file-browser/file-browser-provider";
import { getFileKind } from "./file-browser/file-thumbnail";
import { PicturePreview } from "./picture-preview";

interface StorageFileItemProps {
  file?: StorageFile;
  onRemove?: () => void;
  className?: string;
}

export function StorageFileItem({
  file,
  onRemove,
  className,
}: StorageFileItemProps) {
  const api = useStorageApi();
  const src = file && api.getFileContentUrl(file.id);
  const { icon, colorClassName } = file ? getFileKind(file.mimeType) : UNAVAILABLE_FILE_KIND;

  const item = (
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
          href={src}
          download={file.name}
          title={file.name}
          className="focus-ring min-w-0 flex-1 truncate rounded-sm text-primary group-hover/file:text-foreground"
        >
          {file.name}
        </Typography>
      ) : (
        <Typography className="min-w-0 flex-1 truncate">File not available</Typography>
      )}
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`Remove ${file?.name ?? "File not available"}`}
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      )}
    </div>
  );

  return file?.mimeType.startsWith("image/") && src ? (
    <PicturePreview src={src} alt={file.name}>
      {item}
    </PicturePreview>
  ) : (
    item
  );
}
