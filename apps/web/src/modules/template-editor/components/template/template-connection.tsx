"use client";

import { WifiIcon, WifiOffIcon } from "lucide-react";
import { useTemplateConnection } from "../provider/template-doc-provider";

export function TemplateConnection() {
  const isConnected = useTemplateConnection();

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
