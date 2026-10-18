"use client";

import { Label } from "@tomato/ui";
import type { WidgetPropertyFieldProps } from "../../../template-editor.types";
import { TextEditor } from "../../lexical/text-editor";

export function ContentDescriptor({ value, onChange }: WidgetPropertyFieldProps<"content">) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-content">Content</Label>
      <TextEditor
        id="prop-content"
        value={value}
        onChange={onChange}
        placeholder="Text shown to the person filling out the form…"
      />
    </div>
  );
}
