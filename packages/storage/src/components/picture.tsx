import { cn } from "@tomato/ui";
import type { ReactNode } from "react";

export interface PictureProps {
  src?: string | null;
  alt?: string;
  /** Shown when `src` is missing. */
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
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn("absolute inset-0 size-full object-cover", imageClassName)}
        />
      ) : (
        fallback
      )}
    </div>
  );
}
