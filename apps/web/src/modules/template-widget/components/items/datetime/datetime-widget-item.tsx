"use client";

import { Input } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-widget.types";
import { epochToLocalInputValue, localInputValueToEpoch } from "./datetime";

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
