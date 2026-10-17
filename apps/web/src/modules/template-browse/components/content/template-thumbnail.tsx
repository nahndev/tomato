import { FileTextIcon } from "lucide-react";

interface TemplateThumbnailProps {
  url: string | null;
}

export function TemplateThumbnail({ url }: TemplateThumbnailProps) {
  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-muted">
      {url ? (
        <img
          src={url}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-top"
        />
      ) : (
        <FileTextIcon
          className="absolute inset-0 m-auto size-10 text-muted-foreground in-data-[selected=true]:text-primary"
          strokeWidth={1.25}
        />
      )}
    </div>
  );
}
