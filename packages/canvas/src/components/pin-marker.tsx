import { MapPinIcon } from "@tomato/constants";
import type { CSSProperties } from "react";
import type { CanvasPin } from "../canvas.types";
import { getPinIcon } from "../utils/pin-icon.utils";

import { Typography } from "@tomato/ui";
interface PinMarkerProps {
  pin: CanvasPin;
  isSelected?: boolean;
}

/** The pin's tip is the bottom center of its box; other icons sit in a badge with a tail. */
export function PinMarker({ pin, isSelected = false }: PinMarkerProps) {
  const { icon: Icon } = getPinIcon(pin.icon);
  const isMapPin = Icon === getPinIcon(MapPinIcon.MAP_PIN).icon;

  return (
    <span
      data-selected={isSelected || undefined}
      style={{ "--pin-color": pin.color } as CSSProperties}
      className="group/pin flex flex-col items-center [--pin-color:var(--color-primary)]"
    >
      {isSelected && (
        <Typography className="mb-1 max-w-48 truncate rounded-md bg-card px-2 py-0.5 text-xs font-medium text-foreground shadow-card">
          {pin.label}
        </Typography>
      )}
      {isMapPin ? (
        <Icon
          className="size-8 fill-card text-(--pin-color) drop-shadow-md transition-colors group-data-selected/pin:fill-(--pin-color) group-data-selected/pin:text-primary-foreground"
          strokeWidth={1.75}
        />
      ) : (
        <span className="flex flex-col items-center drop-shadow-md">
          <span className="flex size-8 items-center justify-center rounded-full border-2 border-(--pin-color) bg-card text-(--pin-color) transition-colors group-data-selected/pin:bg-(--pin-color) group-data-selected/pin:text-primary-foreground">
            <Icon className="size-4" strokeWidth={2} />
          </span>
          <span className="-mt-1 size-2 rotate-45 bg-(--pin-color)" />
        </span>
      )}
    </span>
  );
}
