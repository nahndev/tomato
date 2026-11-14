"use client";

import type { FieldComponentProps } from "../../../template-widget.types";

import { Typography } from "@tomato/ui";
export function SystemFieldWidgetItem({ widget }: FieldComponentProps<unknown>) {
  return <Typography as="p" className="mt-2 text-sm text-muted-foreground">{widget.label} — set automatically by the system</Typography>;
}
