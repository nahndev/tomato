"use client";

import { WifiIcon, WifiOffIcon } from "lucide-react";
import { useSubmissionConnection } from "./submission-doc-provider";

export function SubmissionConnection() {
  const isConnected = useSubmissionConnection();

  return isConnected ? (
    <span className="flex items-center gap-1 text-xs text-success">
      <WifiIcon className="size-3" />
      Live
    </span>
  ) : (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <WifiOffIcon className="size-3" />
      Offline
    </span>
  );
}
