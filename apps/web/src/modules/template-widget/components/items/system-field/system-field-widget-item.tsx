"use client";

import type { FieldComponentProps } from "../../../template-widget.types";

export function SystemFieldWidgetItem({ widget }: FieldComponentProps<unknown>) {
  return <p className="mt-2 text-sm text-muted-foreground">{widget.label} — set automatically by the system</p>;
}
