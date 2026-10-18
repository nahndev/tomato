"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-editor.types";
import { sortOptions } from "../../../utils/options";

export function SelectWidgetItem({ widget, value, onChange }: FieldComponentProps<string>) {
  return (
    <Select value={value ?? ""} onValueChange={(next) => onChange?.(next)}>
      <SelectTrigger id={widget.id} className="w-full">
        <SelectValue placeholder="Select…" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions(widget.options).map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
