"use client";

import { Input, Label, Typography } from "@tomato/ui";
import { useRequiredText } from "../../../../hooks/use-required-text";
import type { PropertyFieldProps } from "../../../../template-editor.types";

export function LabelField({ value, onChange }: PropertyFieldProps<"label">) {
  const { text, setText, isInvalid, commit } = useRequiredText(value, onChange);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-label"><Typography>Label</Typography></Label>
      <Input
        id="prop-label"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={commit}
        aria-invalid={isInvalid}
        placeholder="Field label…"
      />
      {isInvalid && <Typography as="p" className="text-xs text-danger">Label is required</Typography>}
    </div>
  );
}
