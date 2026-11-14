"use client";

import { ColorPicker } from "@tomato/color";
import { Button, Typography } from "@tomato/ui";
import { toHexColor } from "@tomato/utils";
import { RotateCcwIcon } from "lucide-react";
import { useState } from "react";

interface ColorFieldProps {
  label: string;
  /** `undefined` is the theme color. */
  value?: string;
  onChange: (color: string | undefined) => void;
}

/** Text that is not a color yet stays in the hex input without being applied. */
export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [draft, setDraft] = useState(value ?? "");
  const isInvalid = draft !== "" && toHexColor(draft) === null;

  function handleChange(next: string) {
    setDraft(next);
    const color = toHexColor(next);
    if (color && color !== value) onChange(color);
  }

  function handleReset() {
    setDraft("");
    onChange(undefined);
  }

  return (
    <div className="flex items-center gap-2">
      <Typography className="flex-1 text-sm text-muted-foreground">{label}</Typography>
      <Typography className="text-xs text-muted-foreground">{value ?? "Default"}</Typography>
      <ColorPicker className="size-8 bg-primary" value={draft} onChange={handleChange} aria-invalid={isInvalid} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={`Reset ${label.toLowerCase()}`}
        title="Reset to default"
        disabled={value === undefined}
        onClick={handleReset}
      >
        <RotateCcwIcon />
      </Button>
    </div>
  );
}
