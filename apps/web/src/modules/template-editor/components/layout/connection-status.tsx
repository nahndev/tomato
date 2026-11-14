"use client";

import { WifiIcon, WifiOffIcon } from "lucide-react";
import { useTemplateConnection } from "../provider/template-doc-provider";

import { Typography } from "@tomato/ui";
export function ConnectionStatus() {
  const isConnected = useTemplateConnection();

  return isConnected ? (
    <Typography className="flex items-center gap-1 text-xs text-success">
      <WifiIcon className="size-3" />
      Live
    </Typography>
  ) : (
    <Typography className="flex items-center gap-1 text-xs text-muted-foreground">
      <WifiOffIcon className="size-3" />
      Offline
    </Typography>
  );
}
