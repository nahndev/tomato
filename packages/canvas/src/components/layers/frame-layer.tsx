"use client";

import { cn } from "@tomato/ui";
import { useEffect } from "react";
import type { Size } from "../../canvas.types";
import { useCanvas } from "../state-provider";

interface FrameLayerProps extends Size {
  className?: string;
}

/** Sets the content size; draws the frame's background. */
export function FrameLayer({ width, height, className }: FrameLayerProps) {
  const setContentSize = useCanvas((state) => state.setContentSize);

  useEffect(() => {
    setContentSize({ width, height });
    return () => setContentSize(null);
  }, [width, height, setContentSize]);

  return <div className={cn("pointer-events-none absolute inset-0 bg-card shadow-card", className)} />;
}
