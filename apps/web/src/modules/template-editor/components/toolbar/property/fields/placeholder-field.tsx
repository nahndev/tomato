"use client";

import { Input, Label, Typography } from "@tomato/ui";
import { useEffect, useState } from "react";
import type { PropertyFieldProps } from "../../../../template-editor.types";

export function PlaceholderField({ value, onChange }: PropertyFieldProps<"placeholder">) {
  const [text, setText] = useState(value ?? "");

  useEffect(() => setText(value ?? ""), [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-placeholder"><Typography>Placeholder</Typography></Label>
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
