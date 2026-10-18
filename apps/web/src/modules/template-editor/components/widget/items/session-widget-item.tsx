"use client";

import { ClockIcon } from "lucide-react";

/** A full-width, fixed block marking a session boundary. Never collects a value. */
export function SessionWidgetItem() {
  return (
    <div className="mt-2 flex items-center gap-2 rounded-md border border-dashed border-primary/40 bg-primary/5 px-2 py-3 text-xs text-muted-foreground">
      <ClockIcon className="size-3.5 text-primary" />
      <span>Full-width, fixed session block</span>
    </div>
  );
}
