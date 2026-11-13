import { Picture } from "@tomato/storage-ui";
import { FileTextIcon } from "lucide-react";

interface TemplateThumbnailProps {
  url: string | null;
}

export function TemplateThumbnail({ url }: TemplateThumbnailProps) {
  return (
    <Picture
      src={url}
      className="aspect-4/3 w-full rounded-md"
      imageClassName="object-top"
      fallback={
        <FileTextIcon
          className="absolute inset-0 m-auto size-10 text-muted-foreground in-data-[selected=true]:text-primary"
          strokeWidth={1.25}
        />
      }
    />
  );
}
