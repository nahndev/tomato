"use client";

import { Input } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-editor.types";

/** Value is an "HH:mm" time-only string. */
export function TimeWidgetItem({ widget, value, onChange }: FieldComponentProps<string>) {
  return <Input id={widget.id} type="time" value={value ?? ""} onChange={(event) => onChange?.(event.target.value)} />;
}
