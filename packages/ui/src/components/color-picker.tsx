"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const NATIVE_INPUT_FALLBACK = "#000000";

const ColorContext = React.createContext<readonly string[]>([]);

function ColorProvider({
  presets,
  children,
}: {
  presets: readonly string[];
  children: React.ReactNode;
}) {
  return <ColorContext.Provider value={presets}>{children}</ColorContext.Provider>;
}

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  "aria-invalid"?: boolean;
}

function ColorPicker({
  value,
  onChange,
  className,
  "aria-invalid": isInvalid,
}: ColorPickerProps) {
  const presets = React.useContext(ColorContext);

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
            value={HEX_COLOR_PATTERN.test(value) ? value : NATIVE_INPUT_FALLBACK}
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

export { ColorPicker, ColorProvider };
