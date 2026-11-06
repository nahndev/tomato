import { AvatarFallback, AvatarImage, Avatar as UiAvatar } from "@tomato/ui";
import type { ReactNode } from "react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  /** Shown while `src` is missing or fails to load. */
  fallback?: ReactNode;
  className?: string;
}

export function Avatar({ src, alt = "", fallback, className }: AvatarProps) {
  return (
    <UiAvatar className={className}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </UiAvatar>
  );
}
