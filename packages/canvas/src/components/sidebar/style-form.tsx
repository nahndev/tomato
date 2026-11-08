"use client";

import type { CanvasPinLayer, CanvasZoneLayer } from "../../canvas.types";
import { useCanvasValue } from "../state-provider";
import { ColorField } from "./color-field";

export function StyleForm({ layer }: { layer: CanvasPinLayer | CanvasZoneLayer }) {
  const { changeColor } = useCanvasValue();

  return (
    <div className="grid gap-2">
      <h3 className="text-xs font-medium text-muted-foreground uppercase">Style</h3>
      <ColorField label="Color" value={layer.color} onChange={(color) => changeColor(layer.id, color)} />
    </div>
  );
}
