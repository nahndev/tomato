import { Button } from "@tomato/ui";
import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";
import { FileBrowserState } from "./file-browser-state";

interface FileBrowserLoadFailedProps {
  title: string;
  retryLabel: string;
  onRetry: () => void;
}

export function FileBrowserLoadFailed({
  title,
  retryLabel,
  onRetry,
}: FileBrowserLoadFailedProps) {
  return (
    <FileBrowserState
      isAlert
      icon={<TriangleAlertIcon />}
      title={title}
      action={
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RotateCwIcon />
          {retryLabel}
        </Button>
      }
    />
  );
}
