"use client";

import { cn } from "@tomato/ui";
import type { CSSProperties } from "react";
import { ARROW_HEAD_SIZE, ARROW_HIT_WIDTH, ARROW_STROKE_WIDTH } from "../../canvas.constants";
import type { CanvasArrowLayer, Point } from "../../canvas.types";
import { useToggleSelect } from "../../hooks/use-toggle-select";
import { useZoneDrag } from "../../hooks/use-zone-drag";
import { toSvgPoints } from "../../utils/zone.utils";
import { useCanvas } from "../state-provider";

interface ArrowLayerProps {
  arrow: CanvasArrowLayer;
  label: string;
  /** Clicks go through to the layers below when neither `isSelectable` nor `onChange` is set. */
  isSelectable?: boolean;
  /** The arrow is movable only when set. */
  onChange?: (id: string, points: Point[]) => void;
  className?: string;
}

/** Head angle from the shaft, each side. */
const HEAD_ANGLE = Math.PI / 6;

/** Drawn in frame pixels, so the head keeps its shape; sizes stay constant on screen. */
export function ArrowLayer({ arrow, label, isSelectable = false, onChange, className }: ArrowLayerProps) {
  const frame = useCanvas((state) => state.contentSize) ?? { width: 1, height: 1 };
  const scale = useCanvas((state) => state.transform.scale);
  const { bind, isDragging, points } = useZoneDrag({
    points: [arrow.start, arrow.end],
    frame,
    onChange: onChange && ((next) => onChange(arrow.id, next)),
  });
  const { isSelected, ...select } = useToggleSelect({ id: arrow.id, isSelectable });
  const isInteractive = isSelectable || Boolean(onChange);

  const [start, end] = points.map(({ x, y }) => ({ x: x * frame.width, y: y * frame.height })) as [Point, Point];
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const head = Math.min(ARROW_HEAD_SIZE / scale, Math.hypot(end.x - start.x, end.y - start.y));
  const corner = (side: number) => ({
    x: end.x - head * Math.cos(angle + side * HEAD_ANGLE),
    y: end.y - head * Math.sin(angle + side * HEAD_ANGLE),
  });
  const shaftEnd = {
    x: end.x - head * Math.cos(HEAD_ANGLE) * Math.cos(angle),
    y: end.y - head * Math.cos(HEAD_ANGLE) * Math.sin(angle),
  };
  const strokeWidth = ((isSelected ? 1.5 : 1) * ARROW_STROKE_WIDTH) / scale;

  return (
    <svg
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      preserveAspectRatio="none"
      style={{ "--arrow-color": arrow.color } as CSSProperties}
      className={cn(
        "pointer-events-none absolute inset-0 size-full overflow-visible [--arrow-color:var(--color-primary)]",
        className,
      )}
    >
      <title>{label}</title>
      {isSelected && (
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          strokeWidth={ARROW_HIT_WIDTH / scale}
          strokeLinecap="round"
          className="stroke-primary/20"
        />
      )}
      <line
        x1={start.x}
        y1={start.y}
        x2={shaftEnd.x}
        y2={shaftEnd.y}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="stroke-(--arrow-color)"
      />
      <polygon points={toSvgPoints([end, corner(1), corner(-1)])} className="fill-(--arrow-color)" />
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        strokeWidth={ARROW_HIT_WIDTH / scale}
        strokeLinecap="round"
        data-interactive={isInteractive || undefined}
        data-movable={Boolean(onChange) || undefined}
        data-dragging={isDragging || undefined}
        className="touch-none stroke-transparent data-interactive:[pointer-events:stroke] data-movable:cursor-move"
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
