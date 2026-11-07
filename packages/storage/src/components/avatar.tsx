import { AvatarFallback, AvatarImage, Avatar as UiAvatar } from "@tomato/ui";
import type { ReactNode } from "react";
import { useStorageApi } from "./file-browser/file-browser-provider";

interface AvatarProps {
  uuid: string;
  alt?: string;
  fallback?: ReactNode;
  className?: string;
}

export function Avatar({ uuid, alt = "", fallback, className }: AvatarProps) {
  const api = useStorageApi();

  return (
    <UiAvatar className={className}>
      <AvatarImage src={api.getFileContentUrl(uuid)} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </UiAvatar>
  );
}
