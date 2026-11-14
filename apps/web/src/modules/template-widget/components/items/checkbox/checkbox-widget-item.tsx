"use client";

import { Typography } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-widget.types";
import { sortOptions } from "../../../utils/options";

export function CheckboxWidgetItem({ widget, value, onChange }: FieldComponentProps<string[]>) {
  const options = sortOptions(widget.options);
  const selected = value ?? [];

  function toggle(key: string) {
    onChange?.(selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key]);
  }

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {options.length === 0 && <Typography className="text-xs text-muted-foreground">No options configured</Typography>}
      {options.map((option, index) => (
        <label key={option.key} className="flex items-center gap-2 text-sm">
          <input
            id={index === 0 ? widget.id : undefined}
            type="checkbox"
            checked={selected.includes(option.key)}
            onChange={() => toggle(option.key)}
            className="size-4 rounded border-input accent-primary"
          />
          {option.value}
        </label>
      ))}
    </div>
  );
}
