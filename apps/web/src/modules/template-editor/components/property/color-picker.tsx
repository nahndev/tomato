"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Input, cn } from "@tomato/ui";
import { COLOR_PRESETS, DEFAULT_COLOR } from "../../template-editor.constants";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const color = value || DEFAULT_COLOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Pick a color"
          className={cn("size-9 rounded-md border border-input shadow-card focus-ring", className)}
          style={{ backgroundColor: color }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto gap-2 p-2">
        <div className="grid grid-cols-6 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-label={preset}
              onClick={() => onChange(preset)}
              className={cn(
                "size-6 rounded-md border border-input transition-transform hover:scale-110",
                color.toLowerCase() === preset && "ring-2 ring-primary ring-offset-1",
              )}
              style={{ backgroundColor: preset }}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(event) => onChange(event.target.value)}
            aria-label="Custom color"
            className="size-9 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
          />
          <Input value={color} onChange={(event) => onChange(event.target.value)} className="h-9 w-full" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
