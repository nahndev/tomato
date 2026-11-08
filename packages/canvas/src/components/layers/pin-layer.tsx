"use client";

import { cn } from "@tomato/ui";
import { usePinDrag } from "../../hooks/use-pin-drag";
import type { CanvasPin, Point } from "../../canvas.types";
import { useCanvas } from "../state-provider";
import { PinMarker } from "../pin-marker";

interface PinLayerProps {
  pin: CanvasPin;
  isSelected?: boolean;
  onSelect?: (id: string | null) => void;
  /** The pin is draggable only when set. */
  onMove?: (id: string, point: Point) => void;
  className?: string;
}

/** Lets clicks outside the pin through to the layers below. */
export function PinLayer({ pin, isSelected = false, onSelect, onMove, className }: PinLayerProps) {
  const scale = useCanvas((state) => state.transform.scale);
  const { ref, isDragging, position } = usePinDrag({ pin, isSelected, onMove });

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      {/* Transforms stay off the draggable, which dnd-kit measures to place the overlay. */}
      <div
        data-selected={isSelected || undefined}
        className="absolute z-10 origin-bottom data-selected:z-20"
        style={{
          left: `${position.x * 100}%`,
          top: `${position.y * 100}%`,
          transform: `translate(-50%, -100%) scale(${1 / scale})`,
        }}
      >
        <button
          ref={ref}
          type="button"
          aria-label={pin.label}
          aria-pressed={isSelected}
          title={pin.label}
          data-movable={Boolean(onMove) || undefined}
          data-dragging={isDragging || undefined}
          className="pointer-events-auto block cursor-pointer touch-none rounded-md focus-ring data-dragging:opacity-0 data-movable:cursor-move"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onSelect?.(isSelected ? null : pin.id)}
        >
          <PinMarker pin={pin} isSelected={isSelected} />
        </button>
      </div>
    </div>
  );
}
