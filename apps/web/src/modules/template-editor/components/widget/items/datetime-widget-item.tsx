"use client";

import { Input } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-editor.types";
import { epochToLocalInputValue, localInputValueToEpoch } from "../../../utils/datetime";

/** Value is an epoch in milliseconds, converted through the browser's local timezone. */
export function DatetimeWidgetItem({ widget, value, onChange }: FieldComponentProps<number>) {
  return (
    <Input
      id={widget.id}
      type="datetime-local"
      value={value != null ? epochToLocalInputValue(value) : ""}
      onChange={(event) => onChange?.(localInputValueToEpoch(event.target.value) as number)}
    />
  );
}
