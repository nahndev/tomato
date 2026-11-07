"use client";

import { cn } from "@tomato/ui";
import { ImageMapLayerType } from "../image-map.constants";
import { FrameLayer } from "./layers/frame-layer";
import { ImageLayer } from "./layers/image-layer";
import { MapLayer } from "./layers/map-layer";
import { PinLayer } from "./layers/pin-layer";
import { useImageMap, useMapValue } from "./state-provider";
import { Viewport } from "./viewport";
import { ZoomControls } from "./zoom-controls";

/** The zoomable frame with its layers and zoom controls. */
export function ImageView({ className }: { className?: string }) {
  const { value, clickPoint, changePin, changeImage } = useMapValue();
  const selectedLayerId = useImageMap((state) => state.selectedLayerId);
  const isAddingPin = useImageMap((state) => state.isAddingPin);
  const selectLayer = useImageMap((state) => state.selectLayer);
  const { frame, layers } = value;
  // While adding a pin, clicks on images go through to the map layer.
  const isImageInteractive = !isAddingPin;

  return (
    <div className={cn("relative min-w-0", className)}>
      <Viewport className="size-full bg-muted">
        <FrameLayer width={frame.width} height={frame.height} />
        <MapLayer className={cn(isAddingPin && "cursor-crosshair")} onPointClick={clickPoint} />
        {layers.map((layer) =>
          layer.type === ImageMapLayerType.IMAGE ? (
            <ImageLayer
              key={layer.id}
              image={layer}
              isSelected={layer.id === selectedLayerId}
              onSelect={isImageInteractive ? selectLayer : undefined}
              onChange={isImageInteractive ? changeImage : undefined}
            />
          ) : null,
        )}
        {layers.map((layer) =>
          layer.type === ImageMapLayerType.PIN ? (
            <PinLayer
              key={layer.id}
              pin={layer}
              isSelected={layer.id === selectedLayerId}
              onSelect={selectLayer}
              onMove={changePin}
            />
          ) : null,
        )}
      </Viewport>
      <ZoomControls className="absolute right-3 bottom-3" />
    </div>
  );
}
