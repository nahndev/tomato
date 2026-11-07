"use client";

import { Button, cn } from "@tomato/ui";
import { MaximizeIcon, MinusIcon, PlusIcon } from "lucide-react";
import { ZOOM_STEP } from "../canvas.constants";
import { useCanvas } from "./state-provider";
import { selectCanZoomIn, selectCanZoomOut, selectZoom } from "../canvas.store";

const PERCENT = 100;

export function ZoomControls({ className }: { className?: string }) {
  const zoom = useCanvas(selectZoom);
  const canZoomIn = useCanvas(selectCanZoomIn);
  const canZoomOut = useCanvas(selectCanZoomOut);
  const zoomBy = useCanvas((state) => state.zoomBy);
  const reset = useCanvas((state) => state.reset);

  return (
    <div className={cn("flex items-center gap-1 rounded-lg bg-card p-1 shadow-card", className)}>
      <Button variant="ghost" size="icon-sm" aria-label="Zoom out" disabled={!canZoomOut} onClick={() => zoomBy(1 / ZOOM_STEP)}>
        <MinusIcon />
      </Button>
      <span className="w-12 text-center text-xs tabular-nums text-muted-foreground" aria-live="polite">
        {Math.round(zoom * PERCENT)}%
      </span>
      <Button variant="ghost" size="icon-sm" aria-label="Zoom in" disabled={!canZoomIn} onClick={() => zoomBy(ZOOM_STEP)}>
        <PlusIcon />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Fit to view" onClick={reset}>
        <MaximizeIcon />
      </Button>
    </div>
  );
}
