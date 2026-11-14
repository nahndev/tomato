import { HoverCard, HoverCardContent, HoverCardTrigger } from "@tomato/ui";
import type { ReactNode } from "react";
import { Picture } from "./picture";

interface PicturePreviewProps {
  src: string;
  alt?: string;
  children: ReactNode;
}

export function PicturePreview({ src, alt = "", children }: PicturePreviewProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-64 p-1">
        <Picture
          src={src}
          alt={alt}
          className="aspect-video w-full rounded-md"
          imageClassName="object-contain"
        />
      </HoverCardContent>
    </HoverCard>
  );
}
