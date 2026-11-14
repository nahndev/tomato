import { cn } from "@tomato/ui";
import { createElement } from "react";
import { DEFAULT_FILE_KIND, FILE_KINDS } from "../../storage.constants";
import { Picture } from "../picture";

export function getFileKind(mimeType: string) {
  return FILE_KINDS.find(({ pattern }) => pattern.test(mimeType)) ?? DEFAULT_FILE_KIND;
}

interface FileThumbnailProps {
  mimeType?: string;
  /** Used only for images. */
  src?: string;
  className?: string;
}

export function FileThumbnail({
  mimeType = "",
  src,
  className,
}: FileThumbnailProps) {
  return (
    <Picture
      src={mimeType.startsWith("image/") ? src : undefined}
      className={cn("size-8 shrink-0 rounded-md", className)}
      fallback={
        <span className="flex size-full items-center justify-center text-muted-foreground">
          {createElement(getFileKind(mimeType).icon, { className: "size-4" })}
        </span>
      }
    />
  );
}
