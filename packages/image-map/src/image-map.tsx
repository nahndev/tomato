import { cn } from "@tomato/ui";
import { useState, type MouseEvent, type ReactNode } from "react";
import { ImageMapPinMarker } from "./image-map-pin-marker";
import type { ImageMapPin, Point, Size } from "./image-map.types";
import { TransformControls } from "./transform-controls";
import { TransformWrapper, useTransform } from "./transform-wrapper";
import { toRatioPoint } from "./transform.utils";

interface ImageMapProps {
  src: string;
  alt?: string;
  pins: readonly ImageMapPin[];
  selectedPinId?: string | null;
  /** Clicking the image places a pin instead of clearing the selection. */
  isAddingPin?: boolean;
  onSelectPin?: (id: string | null) => void;
  /** Receives the point as ratios of the image size, from 0 to 1. */
  onAddPin?: (point: Point) => void;
  /** Pins are draggable only when set. */
  onMovePin?: (id: string, point: Point) => void;
  minZoom?: number;
  maxZoom?: number;
  /** Replaces the default zoom controls; `null` hides them. */
  controls?: ReactNode;
  className?: string;
}

export function ImageMap({ src, alt = "", controls, minZoom, maxZoom, className, ...props }: ImageMapProps) {
  const [loaded, setLoaded] = useState<{ src: string; size: Size } | null>(null);
  const contentSize = loaded?.src === src ? loaded.size : null;

  return (
    <TransformWrapper
      contentSize={contentSize}
      minZoom={minZoom}
      maxZoom={maxZoom}
      className={cn("bg-muted", className)}
      overlay={
        controls === undefined ? <TransformControls className="absolute right-3 bottom-3" /> : controls
      }
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="block size-full max-w-none"
        onLoad={(event) => {
          const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
          setLoaded({ src, size: { width, height } });
        }}
      />
      {contentSize && <ImageMapLayer contentSize={contentSize} {...props} />}
    </TransformWrapper>
  );
}

type ImageMapLayerProps = Pick<
  ImageMapProps,
  "pins" | "selectedPinId" | "isAddingPin" | "onSelectPin" | "onAddPin" | "onMovePin"
> & { contentSize: Size };

function ImageMapLayer({
  contentSize,
  pins,
  selectedPinId,
  isAddingPin = false,
  onSelectPin,
  onAddPin,
  onMovePin,
}: ImageMapLayerProps) {
  const { getContentPoint } = useTransform();

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (isAddingPin && onAddPin) {
      onAddPin(toRatioPoint(getContentPoint({ x: event.clientX, y: event.clientY }), contentSize));
      return;
    }
    onSelectPin?.(null);
  }

  return (
    <div className={cn("absolute inset-0", isAddingPin && "cursor-crosshair")} onClick={handleClick}>
      {pins.map((pin) => (
        <ImageMapPinMarker
          key={pin.id}
          pin={pin}
          contentSize={contentSize}
          isSelected={pin.id === selectedPinId}
          onSelect={onSelectPin}
          onMove={onMovePin}
        />
      ))}
    </div>
  );
}
