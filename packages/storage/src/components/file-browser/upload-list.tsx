import { Button, Progress, Typography } from "@tomato/ui";
import { TriangleAlertIcon, UploadIcon, XIcon } from "lucide-react";
import type { FileBrowserLabels, FileBrowserUpload } from "../../storage.types";

interface UploadListProps {
  uploads: FileBrowserUpload[];
  labels: FileBrowserLabels;
  onDismiss: (id: string) => void;
}

export function UploadList({ uploads, labels, onDismiss }: UploadListProps) {
  if (uploads.length === 0) return null;

  return (
    <ul className="flex max-h-28 shrink-0 flex-col gap-1 overflow-y-auto border-t border-border px-3 py-2">
      {uploads.map(({ id, name, progress, isFailed }) => (
        <li key={id} className="flex min-h-6 items-center gap-2 text-xs">
          {isFailed ? (
            <TriangleAlertIcon className="size-3.5 shrink-0 text-danger" />
          ) : (
            <UploadIcon className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          <Typography title={name} className="min-w-0 flex-1 truncate">
            {name}
          </Typography>
          {isFailed ? (
            <>
              <Typography role="alert" className="shrink-0 text-danger">
                {labels.uploadFailed}
              </Typography>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`${labels.dismiss}: ${name}`}
                onClick={() => onDismiss(id)}
              >
                <XIcon />
              </Button>
            </>
          ) : (
            <Progress
              aria-label={name}
              className="w-24 shrink-0"
              value={Math.round(progress * 100)}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
