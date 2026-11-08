"use client";

import { cn } from "@tomato/ui";
import { useHotkeys } from "react-hotkeys-hook";
import type { Point } from "../../canvas.types";
import { useZoneDraw, type ZoneDrawTool } from "../../hooks/use-zone-draw";
import { toSvgPoints } from "../../utils/zone.utils";
import { useCanvas } from "../state-provider";

interface ZoneDrawLayerProps {
  tool: ZoneDrawTool;
  onDraw: (points: Point[]) => void;
  onCancel: () => void;
  className?: string;
}

/** Captures the pointer above every layer while a zone tool is active. */
export function ZoneDrawLayer({
  tool,
  onDraw,
  onCancel,
  className,
}: ZoneDrawLayerProps) {
  const scale = useCanvas((state) => state.transform.scale);
  const { bind, preview, vertices, hover, isClosable } = useZoneDraw({
    tool,
    onDraw,
    onCancel,
  });
  const path = hover && vertices.length > 0 ? [...vertices, hover] : vertices;

  useHotkeys("esc", onCancel);

  return (
    <div
      data-closable={isClosable || undefined}
      className={cn(
        "absolute inset-0 z-30 cursor-crosshair touch-none data-closable:cursor-pointer",
        "backdrop-blur-md",
        className,
      )}
      {...bind}
    >
      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        {preview && (
          <polygon
            points={toSvgPoints(preview)}
            vectorEffect="non-scaling-stroke"
            className="fill-primary/15 stroke-primary stroke-[1.5] [stroke-dasharray:4_3]"
          />
        )}
        {path.length > 1 && (
          <polyline
            points={toSvgPoints(path)}
            vectorEffect="non-scaling-stroke"
            className="fill-primary/10 stroke-primary stroke-[1.5] [stroke-dasharray:4_3]"
          />
        )}
      </svg>
      {vertices.map((point, index) => (
        <span
          key={index}
          data-first={index === 0 || undefined}
          data-closable={(index === 0 && isClosable) || undefined}
          className="pointer-events-none absolute size-2.5 -translate-1/2 rounded-full border-2 border-primary bg-card data-closable:bg-primary data-first:size-3"
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
