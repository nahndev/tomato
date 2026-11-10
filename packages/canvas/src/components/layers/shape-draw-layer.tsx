"use client";

import { cn } from "@tomato/ui";
import { CanvasTool } from "../../canvas.constants";
import type { Point } from "../../canvas.types";
import { useShapeDraw, type ShapeDrawTool } from "../../hooks/use-shape-draw";
import { toSvgPoints } from "../../utils/zone.utils";
import { useCanvas } from "../state-provider";

interface ShapeDrawLayerProps {
  tool: ShapeDrawTool;
  onDraw: (points: Point[]) => void;
  onCancel: () => void;
  className?: string;
}

/** Captures the pointer above every layer while a shape tool is active; Esc clears the shape, then leaves the tool. */
export function ShapeDrawLayer({
  tool,
  onDraw,
  onCancel,
  className,
}: ShapeDrawLayerProps) {
  const scale = useCanvas((state) => state.transform.scale);
  const { bind, preview, vertices, hover, isClosable, rewindIndex } =
    useShapeDraw({
      tool,
      onDraw,
      onCancel,
    });
  const path = hover && vertices.length > 0 ? [...vertices, hover] : vertices;
  const isArrow = tool === CanvasTool.ARROW;

  return (
    <div
      data-closable={isClosable || undefined}
      data-rewind={rewindIndex !== -1 || undefined}
      className={cn(
        "absolute inset-0 z-30 cursor-crosshair touch-none data-closable:cursor-pointer data-rewind:cursor-pointer",
        className,
      )}
      {...bind}
    >
      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        {preview && isArrow && (
          <polyline
            points={toSvgPoints(preview)}
            vectorEffect="non-scaling-stroke"
            className="fill-none stroke-primary stroke-5 [stroke-dasharray:4_3]"
          />
        )}
        {preview && !isArrow && (
          <polygon
            points={toSvgPoints(preview)}
            vectorEffect="non-scaling-stroke"
            className="fill-primary/50 stroke-primary stroke-5 [stroke-dasharray:4_3]"
          />
        )}
        {path.length > 1 && (
          <polyline
            points={toSvgPoints(path)}
            vectorEffect="non-scaling-stroke"
            className="fill-primary/50 stroke-primary stroke-5 [stroke-dasharray:4_3]"
          />
        )}
      </svg>
      {vertices.map((point, index) => (
        <span
          key={index}
          data-first={index === 0 || undefined}
          data-closable={(index === 0 && isClosable) || undefined}
          data-rewind={index === rewindIndex || undefined}
          className="pointer-events-none absolute size-4 -translate-1/2 rounded-full border-2 border-primary bg-card data-closable:bg-primary data-rewind:bg-primary data-first:size-4"
          style={{
            left: `${point.x * 100}%`,
            top: `${point.y * 100}%`,
            scale: 1 / scale,
          }}
        />
      ))}
    </div>
  );
}
