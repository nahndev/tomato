"use client";

import type { FieldComponentProps } from "../../../template-editor.types";
import { sortOptions } from "../../../utils/options";

/** Single-select list; the value is the selected option key. */
export function RadioWidgetItem({ widget, value, onChange }: FieldComponentProps<string>) {
  const options = sortOptions(widget.options);

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {options.length === 0 && <span className="text-xs text-muted-foreground">No options configured</span>}
      {options.map((option, index) => (
        <label key={option.key} className="flex items-center gap-2 text-sm">
          <input
            id={index === 0 ? widget.id : undefined}
            type="radio"
            name={widget.id}
            checked={value === option.key}
            onChange={() => onChange?.(option.key)}
            className="size-4 border-input accent-primary"
          />
          {option.value}
        </label>
      ))}
    </div>
  );
}
