"use client";

import { cn } from "@tomato/ui";
import type { CSSProperties } from "react";
import type { CanvasZoneLayer, Point } from "../../canvas.types";
import { useToggleSelect } from "../../hooks/use-toggle-select";
import { useZoneDrag } from "../../hooks/use-zone-drag";
import { toSvgPoints } from "../../utils/zone.utils";
import { useCanvas } from "../state-provider";

interface ZoneLayerProps {
  zone: CanvasZoneLayer;
  /** Clicks go through to the layers below when neither `isSelectable` nor `onChange` is set. */
  isSelectable?: boolean;
  /** The zone is movable only when set. */
  onChange?: (id: string, points: Point[]) => void;
  className?: string;
}

export function ZoneLayer({
  zone,
  isSelectable = false,
  onChange,
  className,
}: ZoneLayerProps) {
  const frame = useCanvas((state) => state.contentSize);
  const { bind, isDragging, points } = useZoneDrag({
    points: zone.points,
    frame: frame ?? { width: 1, height: 1 },
    onChange: onChange && ((next) => onChange(zone.id, next)),
  });
  const { isSelected, ...select } = useToggleSelect({
    id: zone.id,
    isSelectable,
  });
  const isInteractive = isSelectable || Boolean(onChange);

  return (
    <svg
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-0 size-full overflow-visible",
        className,
      )}
    >
      <title>{zone.label}</title>
      <polygon
        points={toSvgPoints(points)}
        vectorEffect="non-scaling-stroke"
        data-interactive={isInteractive || undefined}
        data-movable={Boolean(onChange) || undefined}
        data-selected={isSelected || undefined}
        data-dragging={isDragging || undefined}
        style={{ "--zone-color": zone.color } as CSSProperties}
        className="touch-none fill-(--zone-color)/25 stroke-(--zone-color) stroke-[2.5] [--zone-color:var(--color-primary)] data-interactive:pointer-events-auto data-movable:cursor-move data-selected:fill-(--zone-color)/25 data-selected:stroke-5"
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
