"use client";

import { Label, Typography } from "@tomato/ui";
import type { PropertyFieldProps } from "../../../../template-editor.types";
import { TextEditor } from "@/modules/template-widget";

export function ContentField({ value, onChange }: PropertyFieldProps<"content">) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-content"><Typography>Content</Typography></Label>
      <TextEditor
        id="prop-content"
        value={value}
        onChange={onChange}
        placeholder="Text shown to the person filling out the form…"
      />
    </div>
  );
}
