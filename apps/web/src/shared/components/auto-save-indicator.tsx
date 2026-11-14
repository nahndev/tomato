import { Spinner, Typography } from "@tomato/ui";
import { CheckIcon } from "lucide-react";
import { AutoSaveStatus } from "@/shared/hooks/use-auto-save";

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
  errorMessage: string;
  // Set while the value is invalid: it replaces the save status.
  invalidMessage?: string;
}

export function AutoSaveIndicator({
  status,
  errorMessage,
  invalidMessage,
}: AutoSaveIndicatorProps) {
  if (invalidMessage) return <Typography className="text-danger">{invalidMessage}</Typography>;
  if (status === AutoSaveStatus.SAVING) {
    return (
      <>
        <Spinner className="size-4 text-muted-foreground" />
        Saving...
      </>
    );
  }
  if (status === AutoSaveStatus.SAVED) {
    return (
      <>
        <CheckIcon className="size-4" />
        Saved
      </>
    );
  }
  if (status === AutoSaveStatus.ERROR) {
    return <Typography className="text-danger">{errorMessage}</Typography>;
  }
  return null;
}
