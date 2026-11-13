"use client";

import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tomato/ui";
import { useTemplates } from "@/modules/template";
import type { PropertyFieldProps } from "../../../../template-editor.types";

export function LinkTemplateField({ value, onChange }: PropertyFieldProps<"linkTemplateUuid">) {
  const { templates, isLoading } = useTemplates();

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-link-template">Template</Label>
      <Select value={value ?? ""} onValueChange={(next) => onChange(next)} disabled={isLoading}>
        <SelectTrigger id="prop-link-template" className="w-full">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-xs text-muted-foreground">
        Each submission is created from this template, on the same board. Link the template to that board.
      </span>
    </div>
  );
}
