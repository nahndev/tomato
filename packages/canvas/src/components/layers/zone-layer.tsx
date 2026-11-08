"use client";

import { cn } from "@tomato/ui";
import { useToggleSelect } from "../../hooks/use-toggle-select";
import { useZoneDrag } from "../../hooks/use-zone-drag";
import type { CanvasZoneLayer, Point } from "../../canvas.types";
import { toSvgPoints } from "../../utils/zone.utils";
import { useCanvas } from "../state-provider";

interface ZoneLayerProps {
  zone: CanvasZoneLayer;
  isSelected?: boolean;
  /** Clicks go through to the layers below when neither `onSelect` nor `onChange` is set. */
  onSelect?: (id: string | null) => void;
  /** The zone is movable only when set. */
  onChange?: (id: string, points: Point[]) => void;
  className?: string;
}

export function ZoneLayer({ zone, isSelected = false, onSelect, onChange, className }: ZoneLayerProps) {
  const frame = useCanvas((state) => state.contentSize);
  const { bind, isDragging, points } = useZoneDrag({
    points: zone.points,
    frame: frame ?? { width: 1, height: 1 },
    onChange: onChange && ((next) => onChange(zone.id, next)),
  });
  const select = useToggleSelect({ id: zone.id, isSelected, onSelect });
  const isInteractive = Boolean(onSelect || onChange);

  return (
    <svg
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 size-full overflow-visible", className)}
    >
      <title>{zone.label}</title>
      <polygon
        points={toSvgPoints(points)}
        vectorEffect="non-scaling-stroke"
        data-interactive={isInteractive || undefined}
        data-movable={Boolean(onChange) || undefined}
        data-selected={isSelected || undefined}
        data-dragging={isDragging || undefined}
        className="touch-none fill-primary/15 stroke-primary stroke-[1.5] data-interactive:pointer-events-auto data-movable:cursor-move data-selected:fill-primary/25 data-selected:stroke-[2.5]"
        {...bind}
        onPointerDown={(event) => {
          select.onPointerDown(event);
          bind.onPointerDown(event);
        }}
        onClick={select.onClick}
      />
    </svg>
  );
}
