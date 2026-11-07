import { cn } from "@tomato/ui";
import { MapPinIcon } from "lucide-react";
import { useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { DRAG_THRESHOLD } from "./image-map.constants";
import type { ImageMapPin, Point, Size } from "./image-map.types";
import { useTransform } from "./transform-wrapper";
import { getDistance, toRatioPoint } from "./transform.utils";

interface ImageMapPinMarkerProps {
  pin: ImageMapPin;
  contentSize: Size;
  isSelected: boolean;
  onSelect?: (id: string) => void;
  onMove?: (id: string, point: Point) => void;
}

interface Drag {
  pointerId: number;
  start: Point;
  position: Point | null;
}

export function ImageMapPinMarker({ pin, contentSize, isSelected, onSelect, onMove }: ImageMapPinMarkerProps) {
  const { transform, getContentPoint } = useTransform();
  const [drag, setDrag] = useState<Drag | null>(null);
  // The click that follows a drag must not select the pin.
  const hasMovedRef = useRef(false);
  const position = drag?.position ?? pin;

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!onMove || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    hasMovedRef.current = false;
    setDrag({ pointerId: event.pointerId, start: { x: event.clientX, y: event.clientY }, position: null });
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (drag?.pointerId !== event.pointerId) return;
    const client = { x: event.clientX, y: event.clientY };
    if (!drag.position && getDistance(client, drag.start) < DRAG_THRESHOLD) return;
    setDrag({ ...drag, position: toRatioPoint(getContentPoint(client), contentSize) });
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (drag?.pointerId !== event.pointerId) return;
    if (drag.position) {
      hasMovedRef.current = true;
      onMove?.(pin.id, drag.position);
    }
    setDrag(null);
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
    onSelect?.(pin.id);
  }

  return (
    <button
      type="button"
      aria-label={pin.label}
      aria-pressed={isSelected}
      title={pin.label}
      className={cn(
        "absolute flex origin-bottom flex-col items-center rounded-md focus-ring",
        onMove ? "cursor-move" : "cursor-pointer",
        isSelected || drag ? "z-20" : "z-10",
      )}
      style={{
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
        transform: `translate(-50%, -100%) scale(${1 / transform.scale})`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setDrag(null)}
      onClick={handleClick}
    >
      {isSelected && (
        <span className="mb-1 max-w-48 truncate rounded-md bg-card px-2 py-0.5 text-xs font-medium text-foreground shadow-card">
          {pin.label}
        </span>
      )}
      <MapPinIcon
        className={cn(
          "size-8 drop-shadow-md transition-colors",
          isSelected ? "fill-primary text-primary-foreground" : "fill-card text-primary",
        )}
        strokeWidth={1.75}
      />
    </button>
  );
}
