"use client";

import { cn } from "@tomato/ui";
import { useImageDrag } from "../../hooks/use-image-drag";
import { ResizeCorner } from "../../image-map.constants";
import type { ImageMapImageLayer, Rect } from "../../image-map.types";
import { useImageMap } from "../state-provider";

interface ImageLayerProps {
  image: ImageMapImageLayer;
  isSelected?: boolean;
  /** Clicks go through to the layers below when neither `onSelect` nor `onChange` is set. */
  onSelect?: (id: string) => void;
  /** The image is movable and resizable only when set. */
  onChange?: (id: string, rect: Rect) => void;
  className?: string;
}

const CORNER_CLASSES: Record<ResizeCorner, string> = {
  [ResizeCorner.TOP_LEFT]: "top-0 left-0 -translate-1/2 cursor-nwse-resize",
  [ResizeCorner.TOP_RIGHT]: "top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize",
  [ResizeCorner.BOTTOM_LEFT]: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
  [ResizeCorner.BOTTOM_RIGHT]: "right-0 bottom-0 translate-1/2 cursor-nwse-resize",
};

function toStyle({ x, y, width, height }: Rect) {
  return { left: `${x * 100}%`, top: `${y * 100}%`, width: `${width * 100}%`, height: `${height * 100}%` };
}

/** Clipped to the frame; the selection box and handles are not. */
export function ImageLayer({ image, isSelected = false, onSelect, onChange, className }: ImageLayerProps) {
  const frame = useImageMap((state) => state.contentSize);
  const scale = useImageMap((state) => state.transform.scale);
  const { bind, isDragging, rect } = useImageDrag({
    rect: image,
    frame: frame ?? { width: 1, height: 1 },
    onChange: onChange && ((next) => onChange(image.id, next)),
  });
  const isInteractive = Boolean(onSelect || onChange);
  const style = toStyle(rect);
  const move = bind();

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image.src}
          alt={image.alt ?? ""}
          draggable={false}
          className="absolute max-w-none object-fill"
          style={style}
        />
      </div>
      <div
        data-interactive={isInteractive || undefined}
        data-movable={Boolean(onChange) || undefined}
        data-selected={isSelected || undefined}
        data-dragging={isDragging || undefined}
        className="absolute touch-none data-interactive:pointer-events-auto data-movable:cursor-move data-selected:outline-2 data-selected:outline-primary"
        style={{ ...style, outlineWidth: isSelected ? 2 / scale : undefined }}
        {...move}
        onPointerDown={(event) => {
          if (event.button === 0) onSelect?.(image.id);
          move.onPointerDown(event);
        }}
      >
        {isSelected &&
          onChange &&
          Object.values(ResizeCorner).map((corner) => (
            <span
              key={corner}
              className={cn("absolute size-3 rounded-full border-2 border-primary bg-card", CORNER_CLASSES[corner])}
              style={{ scale: 1 / scale }}
              {...bind(corner)}
            />
          ))}
      </div>
    </div>
  );
}
