"use client";

import { Checkbox, Label } from "@tomato/ui";
import type { WidgetPropertyFieldProps } from "../../../template-editor.types";

export function RequiredDescriptor({ value, onChange }: WidgetPropertyFieldProps<"required">) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="prop-required" checked={Boolean(value)} onCheckedChange={(checked) => onChange(checked === true)} />
      <Label htmlFor="prop-required">Required</Label>
    </div>
  );
}
