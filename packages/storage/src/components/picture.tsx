import { cn, Skeleton } from "@tomato/ui";
import { useState, type ReactNode } from "react";

interface PictureProps {
  src?: string | null;
  alt?: string;
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
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {src && src !== failedSrc ? (
        <>
          {src !== loadedSrc && <Skeleton className="absolute inset-0 rounded-none" />}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className={cn("absolute inset-0 size-full object-cover", imageClassName)}
            onLoad={() => setLoadedSrc(src)}
            onError={() => setFailedSrc(src)}
          />
        </>
      ) : (
        fallback
      )}
    </div>
  );
}
