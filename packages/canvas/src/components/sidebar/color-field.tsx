"use client";

import { Button } from "@tomato/ui";
import { ColorPicker, ColorProvider } from "@tomato/ui/client";
import { toHexColor } from "@tomato/utils";
import { RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { LAYER_COLOR_PRESETS } from "../../canvas.constants";

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
      <span className="flex-1 text-sm text-muted-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">{value ?? "Default"}</span>
      <ColorProvider presets={LAYER_COLOR_PRESETS}>
        <ColorPicker
          className="size-8 bg-primary"
          value={draft}
          onChange={handleChange}
          aria-invalid={isInvalid}
        />
      </ColorProvider>
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
