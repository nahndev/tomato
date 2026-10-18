"use client";

import { Input, Label } from "@tomato/ui";
import { useEffect, useState } from "react";
import type { WidgetPropertyFieldProps } from "../../../template-editor.types";

export function PlaceholderDescriptor({ value, onChange }: WidgetPropertyFieldProps<"placeholder">) {
  const [text, setText] = useState(value ?? "");

  useEffect(() => setText(value ?? ""), [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-placeholder">Placeholder</Label>
      <Input
        id="prop-placeholder"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={() => onChange(text || undefined)}
        placeholder="Placeholder text…"
      />
    </div>
  );
}
