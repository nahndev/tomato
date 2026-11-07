import { cn } from "@tomato/ui";
import { useState, type ReactNode } from "react";

export interface PictureProps {
  src?: string | null;
  alt?: string;
  /** Shown when `src` is missing or fails to load. */
  fallback?: ReactNode;
  className?: string;
  imageClassName?: string;
}

export function Picture({
  src,
  alt = "",
  fallback,
  className,
  imageClassName,
}: PictureProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {src && src !== failedSrc ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn("absolute inset-0 size-full object-cover", imageClassName)}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        fallback
      )}
    </div>
  );
}
