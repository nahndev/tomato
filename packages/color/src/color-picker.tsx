"use client";

import { Input, Popover, PopoverContent, PopoverTrigger, cn } from "@tomato/ui";
import { toHexColor } from "@tomato/utils";
import { useColors } from "./color-provider";

const NATIVE_INPUT_FALLBACK = "#000000";

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  "aria-invalid"?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  className,
  "aria-invalid": isInvalid,
}: ColorPickerProps) {
  const presets = useColors();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Pick a color"
          aria-invalid={isInvalid}
          data-slot="color-picker"
          className={cn(
            "size-9 shrink-0 cursor-pointer rounded-md border border-input shadow-card focus-ring",
            className,
          )}
          style={{ backgroundColor: value }}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="grid w-auto gap-2 p-2">
        {presets.length > 0 && (
          <div className="grid grid-cols-6 gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-label={preset}
                aria-pressed={value.toLowerCase() === preset.toLowerCase()}
                onClick={() => onChange(preset)}
                className="size-6 cursor-pointer rounded-md border border-input motion-base hover:scale-110 focus-ring aria-pressed:ring-2 aria-pressed:ring-primary aria-pressed:ring-offset-1"
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={toHexColor(value) ?? NATIVE_INPUT_FALLBACK}
            onChange={(event) => onChange(event.target.value)}
            aria-label="Custom color"
            className="size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
          />
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label="Hex color"
            className="h-9 w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
