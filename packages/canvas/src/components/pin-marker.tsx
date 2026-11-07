import { MapPinIcon } from "lucide-react";
import type { CanvasPin } from "../canvas.types";

interface PinMarkerProps {
  pin: CanvasPin;
  isSelected?: boolean;
}

/** The pin's tip is the bottom center of its box. */
export function PinMarker({ pin, isSelected = false }: PinMarkerProps) {
  return (
    <span data-selected={isSelected || undefined} className="group/pin flex flex-col items-center">
      {isSelected && (
        <span className="mb-1 max-w-48 truncate rounded-md bg-card px-2 py-0.5 text-xs font-medium text-foreground shadow-card">
          {pin.label}
        </span>
      )}
      <MapPinIcon
        className="size-8 fill-card text-primary drop-shadow-md transition-colors group-data-selected/pin:fill-primary group-data-selected/pin:text-primary-foreground"
        strokeWidth={1.75}
      />
    </span>
  );
}
