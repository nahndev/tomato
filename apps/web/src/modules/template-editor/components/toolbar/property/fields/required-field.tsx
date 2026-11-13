"use client";

import { Checkbox, Label } from "@tomato/ui";
import type { PropertyFieldProps } from "../../../../template-editor.types";

export function RequiredField({ value, onChange }: PropertyFieldProps<"required">) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="prop-required" checked={Boolean(value)} onCheckedChange={(checked) => onChange(checked === true)} />
      <Label htmlFor="prop-required">Required</Label>
    </div>
  );
}
