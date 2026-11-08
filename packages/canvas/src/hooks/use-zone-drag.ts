import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useCanvas } from "../components/state-provider";
import { DRAG_THRESHOLD } from "../canvas.constants";
import type { Point, Size } from "../canvas.types";
import { getClientPoint, getDistance } from "../utils/transform.utils";
import { isSamePoints, movePoints } from "../utils/zone.utils";

interface UseZoneDragOptions {
  points: readonly Point[];
  frame: Size;
  /** The zone is movable only when set. */
  onChange?: (points: Point[]) => void;
}

interface Drag {
  pointerId: number;
  start: Point;
  from: readonly Point[];
  hasMoved: boolean;
}

export function useZoneDrag({ points, frame, onChange }: UseZoneDragOptions) {
  const scale = useCanvas((state) => state.transform.scale);
  const dragRef = useRef<Drag | null>(null);
  const [draft, setDraft] = useState<Point[] | null>(null);
  // `onChange` may update `points` a few frames after the drag ends.
  const [drop, setDrop] = useState<{ points: Point[]; from: readonly Point[] } | null>(null);
  const isDropPending = drop !== null && isSamePoints(drop.from, points);
  if (drop && !isDropPending) setDrop(null);

  function getNext(drag: Drag, client: Point): Point[] {
    const delta = {
      x: (client.x - drag.start.x) / scale / frame.width,
      y: (client.y - drag.start.y) / scale / frame.height,
    };
    return movePoints(drag.from, delta);
  }

  function getDrag(event: ReactPointerEvent): Drag | null {
    const drag = dragRef.current;
    return drag?.pointerId === event.pointerId ? drag : null;
  }

  const bind = {
    onPointerDown: (event: ReactPointerEvent<Element>) => {
      if (!onChange || event.button !== 0 || dragRef.current) return;
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = { pointerId: event.pointerId, start: getClientPoint(event), from: points, hasMoved: false };
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
      setDrop({ points: next, from: points });
      onChange?.(next);
    },
    onPointerCancel: (event: ReactPointerEvent) => {
      if (!getDrag(event)) return;
      dragRef.current = null;
      setDraft(null);
    },
  };

  return { bind, isDragging: draft !== null, points: draft ?? (isDropPending ? drop.points : points) };
}
