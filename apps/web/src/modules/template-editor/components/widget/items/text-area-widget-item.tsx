"use client";

import { Textarea } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-editor.types";

export function TextAreaWidgetItem({ widget, value, onChange }: FieldComponentProps<string>) {
  return (
    <Textarea
      id={widget.id}
      rows={3}
      value={value ?? ""}
      placeholder={widget.placeholder ?? "Enter text…"}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}
