"use client";

import type { MapPinIcon } from "@tomato/constants";
import { DropdownMenuItem } from "@tomato/ui";
import { PIN_ICONS } from "../canvas.constants";

interface PinIconGridProps {
  value: string;
  onSelect: (icon: MapPinIcon) => void;
}

/** Items of a `DropdownMenuContent`. */
export function PinIconGrid({ value, onSelect }: PinIconGridProps) {
  return (
    <div role="group" aria-label="Icons" className="grid grid-cols-4 gap-1">
      {(Object.entries(PIN_ICONS) as [MapPinIcon, (typeof PIN_ICONS)[MapPinIcon]][]).map(([icon, { label, icon: Icon }]) => (
        <DropdownMenuItem
          key={icon}
          aria-label={label}
          aria-checked={icon === value}
          role="menuitemradio"
          title={label}
          className="justify-center p-2 aria-checked:bg-muted aria-checked:text-primary"
          onSelect={() => onSelect(icon)}
        >
          <Icon className="size-5" />
        </DropdownMenuItem>
      ))}
    </div>
  );
}
