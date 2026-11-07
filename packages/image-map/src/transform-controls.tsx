import { Button, cn } from "@tomato/ui";
import { MaximizeIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useTransform } from "./transform-wrapper";

const PERCENT = 100;

export function TransformControls({ className }: { className?: string }) {
  const { zoom, canZoomIn, canZoomOut, zoomIn, zoomOut, reset } = useTransform();

  return (
    <div
      className={cn("flex items-center gap-1 rounded-lg bg-card p-1 shadow-card", className)}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Button variant="ghost" size="icon-sm" aria-label="Zoom out" disabled={!canZoomOut} onClick={zoomOut}>
        <MinusIcon />
      </Button>
      <span className="w-12 text-center text-xs tabular-nums text-muted-foreground" aria-live="polite">
        {Math.round(zoom * PERCENT)}%
      </span>
      <Button variant="ghost" size="icon-sm" aria-label="Zoom in" disabled={!canZoomIn} onClick={zoomIn}>
        <PlusIcon />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Fit to view" onClick={reset}>
        <MaximizeIcon />
      </Button>
    </div>
  );
}
