import { AvatarFallback, AvatarImage, Spinner, Avatar as UiAvatar } from "@tomato/ui";
import { useState, type ReactNode } from "react";
import { useStorageApi } from "./file-browser/file-browser-provider";

interface AvatarProps {
  uuid?: string | null;
  alt?: string;
  /** Shown when there is no file or it fails to load. */
  children?: ReactNode;
  /** Covers the avatar while external work runs, such as an upload. */
  isLoading?: boolean;
  className?: string;
}

export function Avatar({ uuid, alt = "", children, isLoading = false, className }: AvatarProps) {
  const api = useStorageApi();
  const [settledSrc, setSettledSrc] = useState<string | null>(null);

  const src = uuid ? api.getFileContentUrl(uuid) : null;
  const isImageLoading = src !== null && src !== settledSrc;

  return (
    <UiAvatar className={className}>
      {src && (
        <AvatarImage
          // Radix reports no status change between two images that are both cached.
          key={src}
          src={src}
          alt={alt}
          onLoadingStatusChange={(status) => {
            if (status === "loaded" || status === "error") setSettledSrc(src);
          }}
        />
      )}
      <AvatarFallback>{isImageLoading && !isLoading ? <Spinner /> : children}</AvatarFallback>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center bg-overlay">
          <Spinner />
        </span>
      )}
    </UiAvatar>
  );
}
