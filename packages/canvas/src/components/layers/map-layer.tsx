"use client";

import { cn } from "@tomato/ui";
import type { ComponentProps } from "react";
import type { Point } from "../../canvas.types";
import { getClientPoint } from "../../utils/transform.utils";
import { useCanvas } from "../state-provider";

interface MapLayerProps extends Omit<ComponentProps<"div">, "onClick"> {
  /** Receives the point as ratios of the content size, from 0 to 1. */
  onPointClick?: (point: Point) => void;
}

export function MapLayer({ onPointClick, className, ...props }: MapLayerProps) {
  const getRatioPoint = useCanvas((state) => state.getRatioPoint);
  return (
    <div
      className={cn("absolute inset-0", className)}
      onClick={(event) => onPointClick?.(getRatioPoint(getClientPoint(event)))}
      {...props}
    />
  );
}
