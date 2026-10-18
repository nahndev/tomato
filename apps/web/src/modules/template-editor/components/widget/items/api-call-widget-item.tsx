"use client";

import { Badge } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-editor.types";

/** Builder-time placeholder; the request is configured in the property panel but never executed here. */
export function ApiCallWidgetItem({ widget }: FieldComponentProps<unknown>) {
  const { apiCall } = widget;

  return (
    <div className="flex flex-col gap-1 rounded-md border border-dashed border-input p-3">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{apiCall?.method ?? "GET"}</Badge>
        <span className="truncate text-sm text-muted-foreground">{apiCall?.url || "No URL configured"}</span>
      </div>
      <p className="text-xs text-muted-foreground">Request execution is not wired up yet.</p>
    </div>
  );
}
