"use client";

import { CanvasLayerType } from "../../canvas.constants";
import type { CanvasPinLayer, CanvasZoneLayer } from "../../canvas.types";
import { useCanvasValue } from "../state-provider";
import { ColorField } from "./color-field";

export function StyleForm({ layer }: { layer: CanvasPinLayer | CanvasZoneLayer }) {
  const { changePinStyle, changeZoneStyle } = useCanvasValue();

  return (
    <div className="grid gap-2">
      <h3 className="text-xs font-medium text-muted-foreground uppercase">Style</h3>
      {layer.type === CanvasLayerType.PIN ? (
        <ColorField label="Color" value={layer.color} onChange={(color) => changePinStyle(layer.id, { color })} />
      ) : (
        <>
          <ColorField
            label="Fill"
            value={layer.fillColor}
            onChange={(fillColor) => changeZoneStyle(layer.id, { fillColor })}
          />
          <ColorField
            label="Stroke"
            value={layer.strokeColor}
            onChange={(strokeColor) => changeZoneStyle(layer.id, { strokeColor })}
          />
        </>
      )}
    </div>
  );
}
