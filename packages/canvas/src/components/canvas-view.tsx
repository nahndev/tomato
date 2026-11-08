"use client";

import { cn } from "@tomato/ui";
import { CanvasLayerType, CanvasTool } from "../canvas.constants";
import { FrameLayer } from "./layers/frame-layer";
import { ImageLayer } from "./layers/image-layer";
import { MapLayer } from "./layers/map-layer";
import { PinLayer } from "./layers/pin-layer";
import { ZoneDrawLayer } from "./layers/zone-draw-layer";
import { ZoneLayer } from "./layers/zone-layer";
import { useCanvas, useCanvasValue } from "./state-provider";
import { Viewport } from "./viewport";
import { ZoomControls } from "./zoom-controls";

export function CanvasView({ className }: { className?: string }) {
  const { value, clickPoint, changePin, changeImage, changeZone, addZone } = useCanvasValue();
  const selectedLayerId = useCanvas((state) => state.selectedLayerId);
  const tool = useCanvas((state) => state.tool);
  const setTool = useCanvas((state) => state.setTool);
  const selectLayer = useCanvas((state) => state.selectLayer);
  const { frame, layers } = value;
  // While placing a pin, clicks on images and zones go through to the map layer.
  const isSelecting = tool === CanvasTool.SELECT;

  return (
    <div className={cn("relative min-w-0", className)}>
      <Viewport className="size-full bg-muted">
        <FrameLayer width={frame.width} height={frame.height} />
        <MapLayer className={cn(tool === CanvasTool.PIN && "cursor-crosshair")} onPointClick={clickPoint} />
        {layers.map((layer) =>
          layer.type === CanvasLayerType.IMAGE ? (
            <ImageLayer
              key={layer.id}
              image={layer}
              isSelected={layer.id === selectedLayerId}
              onSelect={isSelecting ? selectLayer : undefined}
              onChange={isSelecting && !layer.isLocked ? changeImage : undefined}
            />
          ) : null,
        )}
        {layers.map((layer) =>
          layer.type === CanvasLayerType.ZONE ? (
            <ZoneLayer
              key={layer.id}
              zone={layer}
              isSelected={layer.id === selectedLayerId}
              onSelect={isSelecting ? selectLayer : undefined}
              onChange={isSelecting && !layer.isLocked ? changeZone : undefined}
            />
          ) : null,
        )}
        {layers.map((layer) =>
          layer.type === CanvasLayerType.PIN ? (
            <PinLayer
              key={layer.id}
              pin={layer}
              isSelected={layer.id === selectedLayerId}
              onSelect={selectLayer}
              onMove={layer.isLocked ? undefined : changePin}
            />
          ) : null,
        )}
        {(tool === CanvasTool.RECTANGLE || tool === CanvasTool.POLYGON) && (
          <ZoneDrawLayer key={tool} tool={tool} onDraw={addZone} onCancel={() => setTool(CanvasTool.SELECT)} />
        )}
      </Viewport>
      <ZoomControls className="absolute right-3 bottom-3" />
    </div>
  );
}
