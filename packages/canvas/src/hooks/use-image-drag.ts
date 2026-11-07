import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useCanvas } from "../components/state-provider";
import { DRAG_THRESHOLD, type ResizeCorner } from "../canvas.constants";
import type { Point, Rect, Size } from "../canvas.types";
import { isSameRect, moveRect, resizeRect } from "../utils/rect.utils";
import { getClientPoint, getDistance } from "../utils/transform.utils";

interface UseImageDragOptions {
  rect: Rect;
  frame: Size;
  /** The image is movable and resizable only when set. */
  onChange?: (rect: Rect) => void;
}

interface Drag {
  pointerId: number;
  start: Point;
  from: Rect;
  corner: ResizeCorner | null;
  hasMoved: boolean;
}

/** Moves (`bind()`) or resizes (`bind(corner)`) with the pointer; returns the rect to draw. */
export function useImageDrag({ rect, frame, onChange }: UseImageDragOptions) {
  const scale = useCanvas((state) => state.transform.scale);
  const dragRef = useRef<Drag | null>(null);
  const [draft, setDraft] = useState<Rect | null>(null);
  // `onChange` may update `rect` a few frames after the drag ends.
  const [drop, setDrop] = useState<{ rect: Rect; from: Rect } | null>(null);
  const isDropPending = drop !== null && isSameRect(drop.from, rect);
  if (drop && !isDropPending) setDrop(null);

  function getNext(drag: Drag, client: Point): Rect {
    const delta = { x: (client.x - drag.start.x) / scale, y: (client.y - drag.start.y) / scale };
    return drag.corner ? resizeRect(drag.from, drag.corner, delta, frame) : moveRect(drag.from, delta, frame);
  }

  function getDrag(event: ReactPointerEvent): Drag | null {
    const drag = dragRef.current;
    return drag?.pointerId === event.pointerId ? drag : null;
  }

  function bind(corner: ResizeCorner | null = null) {
    return {
      onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
        if (!onChange || event.button !== 0 || dragRef.current) return;
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = { pointerId: event.pointerId, start: getClientPoint(event), from: rect, corner, hasMoved: false };
      },
      onPointerMove: (event: ReactPointerEvent) => {
        const drag = getDrag(event);
        if (!drag) return;
        const client = getClientPoint(event);
        if (!drag.hasMoved && getDistance(drag.start, client) < DRAG_THRESHOLD) return;
        drag.hasMoved = true;
        setDraft(getNext(drag, client));
      },
      onPointerUp: (event: ReactPointerEvent) => {
        const drag = getDrag(event);
        if (!drag) return;
        dragRef.current = null;
        setDraft(null);
        if (!drag.hasMoved) return;
        const next = getNext(drag, getClientPoint(event));
        setDrop({ rect: next, from: rect });
        onChange?.(next);
      },
      onPointerCancel: (event: ReactPointerEvent) => {
        if (!getDrag(event)) return;
        dragRef.current = null;
        setDraft(null);
      },
    };
  }

  return { bind, isDragging: draft !== null, rect: draft ?? (isDropPending ? drop.rect : rect) };
}
