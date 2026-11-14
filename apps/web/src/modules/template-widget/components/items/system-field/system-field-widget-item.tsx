"use client";

import { Typography } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-widget.types";

export function SystemFieldWidgetItem({ widget }: FieldComponentProps) {
  return <Typography as="p" className="mt-2 text-sm text-muted-foreground">{widget.label} — set automatically by the system</Typography>;
}
