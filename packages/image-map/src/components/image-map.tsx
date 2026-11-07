"use client";

import { cn } from "@tomato/ui";
import { useImageMapValue } from "../hooks/use-image-map-value";
import { ImageMapLayerType } from "../image-map.constants";
import type { ImageMapValue } from "../image-map.types";
import { ImageMapProvider } from "./image-map-provider";
import { FrameLayer } from "./layers/frame-layer";
import { ImageLayer } from "./layers/image-layer";
import { MapLayer } from "./layers/map-layer";
import { PinLayer } from "./layers/pin-layer";
import { Viewport } from "./viewport";
import { ZoomControls } from "./zoom-controls";

interface ImageMapProps {
  value: ImageMapValue;
  onChangeValue?: (value: ImageMapValue) => void;
  className?: string;
}

export function ImageMap({ className, ...props }: ImageMapProps) {
  return (
    <ImageMapProvider>
      <div className={cn("relative", className)}>
        <ImageMapContent {...props} />
        <ZoomControls className="absolute right-3 bottom-3" />
      </div>
    </ImageMapProvider>
  );
}

function ImageMapContent({ value, onChangeValue }: Omit<ImageMapProps, "className">) {
  const { frame, layers, viewport } = value;
  const { selectLayer, clickPoint, movePin, changeImage } = useImageMapValue(value, onChangeValue);
  // While adding a pin, clicks on images go through to the map layer.
  const isImageInteractive = !viewport.isAddingPin;

  return (
    <Viewport className="size-full bg-muted">
      <FrameLayer width={frame.width} height={frame.height} />
      <MapLayer className={cn(viewport.isAddingPin && "cursor-crosshair")} onPointClick={clickPoint} />
      {layers.map((layer) =>
        layer.type === ImageMapLayerType.IMAGE ? (
          <ImageLayer
            key={layer.id}
            image={layer}
            isSelected={layer.id === viewport.selectedLayerId}
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
            isSelected={layer.id === viewport.selectedLayerId}
            onSelect={selectLayer}
            onMove={movePin}
          />
        ) : null,
      )}
    </Viewport>
  );
}
