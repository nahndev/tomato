import { cn } from "@tomato/ui";
import {
  FileArchiveIcon,
  FileIcon,
  FileImageIcon,
  FileMusicIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoCameraIcon,
} from "lucide-react";
import { createElement } from "react";
import { Picture } from "../picture";

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return FileImageIcon;
  if (mimeType.startsWith("video/")) return FileVideoCameraIcon;
  if (mimeType.startsWith("audio/")) return FileMusicIcon;
  if (/sheet|excel|csv/.test(mimeType)) return FileSpreadsheetIcon;
  if (/zip|compressed|tar|rar/.test(mimeType)) return FileArchiveIcon;
  if (/^text\/|pdf|document|msword/.test(mimeType)) return FileTextIcon;
  return FileIcon;
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
          {createElement(getFileIcon(mimeType), { className: "size-4" })}
        </span>
      }
    />
  );
}
