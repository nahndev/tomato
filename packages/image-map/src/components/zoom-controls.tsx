"use client";

import { Button, cn } from "@tomato/ui";
import { MaximizeIcon, MinusIcon, PlusIcon } from "lucide-react";
import { ZOOM_STEP } from "../image-map.constants";
import { useImageMap } from "./state-provider";
import { selectCanZoomIn, selectCanZoomOut, selectZoom } from "../image-map.store";

const PERCENT = 100;

export function ZoomControls({ className }: { className?: string }) {
  const zoom = useImageMap(selectZoom);
  const canZoomIn = useImageMap(selectCanZoomIn);
  const canZoomOut = useImageMap(selectCanZoomOut);
  const zoomBy = useImageMap((state) => state.zoomBy);
  const reset = useImageMap((state) => state.reset);

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
