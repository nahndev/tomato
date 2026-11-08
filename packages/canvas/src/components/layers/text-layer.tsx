"use client";

import { cn } from "@tomato/ui";
import type { CSSProperties } from "react";
import type { CanvasTextLayer, Point } from "../../canvas.types";
import { useToggleSelect } from "../../hooks/use-toggle-select";
import { useZoneDrag } from "../../hooks/use-zone-drag";
import { useCanvas } from "../state-provider";

interface TextLayerProps {
  text: CanvasTextLayer;
  /** Clicks go through to the layers below when neither `isSelectable` nor `onChange` is set; double-click edits when set. */
  isSelectable?: boolean;
  /** The text is movable only when set. */
  onChange?: (id: string, point: Point) => void;
  className?: string;
}

export function textStyle(text: CanvasTextLayer, position: Point = text): CSSProperties {
  return {
    left: `${position.x * 100}%`,
    top: `${position.y * 100}%`,
    fontSize: text.fontSize,
    "--text-color": text.color,
  } as CSSProperties;
}

export const TEXT_CLASS_NAME =
  "absolute leading-tight font-medium whitespace-pre text-(--text-color) [--text-color:var(--color-foreground)]";

/** Hidden while `TextEditor` edits it. */
export function TextLayer({ text, isSelectable = false, onChange, className }: TextLayerProps) {
  const frame = useCanvas((state) => state.contentSize);
  const scale = useCanvas((state) => state.transform.scale);
  const isEditing = useCanvas((state) => state.editingLayerId === text.id);
  const setEditingLayer = useCanvas((state) => state.setEditingLayer);
  const { bind, isDragging, points } = useZoneDrag({
    points: [text],
    frame: frame ?? { width: 1, height: 1 },
    onChange: onChange && (([point]) => onChange(text.id, point!)),
  });
  const { isSelected, ...select } = useToggleSelect({ id: text.id, isSelectable });
  const isInteractive = isSelectable || Boolean(onChange);

  if (isEditing) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <div
        data-interactive={isInteractive || undefined}
        data-movable={Boolean(onChange) || undefined}
        data-selected={isSelected || undefined}
        data-dragging={isDragging || undefined}
        style={{ ...textStyle(text, points[0]), outlineWidth: isSelected ? 2 / scale : undefined }}
        className={cn(
          TEXT_CLASS_NAME,
          "touch-none data-interactive:pointer-events-auto data-movable:cursor-move data-selected:outline-2 data-selected:outline-primary",
        )}
        {...bind}
        onPointerDown={(event) => {
          select.onPointerDown(event);
          bind.onPointerDown(event);
        }}
        onClick={select.onClick}
        onDoubleClick={() => isSelectable && setEditingLayer(text.id)}
      >
        {text.text}
      </div>
    </div>
  );
}
