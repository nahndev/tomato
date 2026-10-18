"use client";

import { Input } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-editor.types";

export function NumberWidgetItem({ widget, value, onChange }: FieldComponentProps<number>) {
  return (
    <Input
      id={widget.id}
      type="number"
      value={value ?? ""}
      placeholder={widget.placeholder ?? "0"}
      onChange={(event) => onChange?.(event.target.valueAsNumber)}
    />
  );
}
