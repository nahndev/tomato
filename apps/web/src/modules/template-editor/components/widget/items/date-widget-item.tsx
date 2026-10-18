"use client";

import { Input } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-editor.types";

/** Value is a "YYYY-MM-DD" date-only string. */
export function DateWidgetItem({ widget, value, onChange }: FieldComponentProps<string>) {
  return <Input id={widget.id} type="date" value={value ?? ""} onChange={(event) => onChange?.(event.target.value)} />;
}
