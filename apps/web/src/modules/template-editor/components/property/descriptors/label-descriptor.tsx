"use client";

import { Input, Label } from "@tomato/ui";
import { useRequiredText } from "../../../hooks/use-required-text";
import type { WidgetPropertyFieldProps } from "../../../template-editor.types";

export function LabelDescriptor({ value, onChange }: WidgetPropertyFieldProps<"label">) {
  const { text, setText, isInvalid, commit } = useRequiredText(value, onChange);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-label">Label</Label>
      <Input
        id="prop-label"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={commit}
        aria-invalid={isInvalid}
        placeholder="Field label…"
      />
      {isInvalid && <p className="text-xs text-danger">Label is required</p>}
    </div>
  );
}
