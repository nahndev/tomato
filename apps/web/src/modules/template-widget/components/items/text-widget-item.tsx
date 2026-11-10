"use client";

import { Input } from "@tomato/ui";
import type { FieldComponentProps } from "../../template-widget.types";

export function TextWidgetItem({ widget, value, onChange }: FieldComponentProps<string>) {
  return (
    <Input
      id={widget.id}
      type="text"
      value={value ?? ""}
      placeholder={widget.placeholder ?? "Enter text…"}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}
