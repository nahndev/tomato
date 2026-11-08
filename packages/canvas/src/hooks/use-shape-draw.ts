import { useEffect, useEffectEvent, useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { useCanvas } from "../components/state-provider";
import { MAP_ZONE_MIN_POINTS } from "@tomato/constants";
import {
  CANCEL_KEY,
  CanvasTool,
  FINISH_KEY,
  MIN_ZONE_DRAG_SIZE,
  UNDO_POINT_KEY,
  ZONE_CLOSE_DISTANCE,
} from "../canvas.constants";
import type { Point } from "../canvas.types";
import { isEditable } from "../utils/event.utils";
import { getClientPoint } from "../utils/transform.utils";
import { dedupePoints, getRectPoints } from "../utils/zone.utils";

export type ZoneDrawTool = typeof CanvasTool.RECTANGLE | typeof CanvasTool.POLYGON;

interface UseZoneDrawOptions {
  tool: ZoneDrawTool;
  onDraw: (points: Point[]) => void;
  onCancel: () => void;
}

interface RectDrag {
  pointerId: number;
  start: Point;
  end: Point;
  isSquare: boolean;
}

export function useZoneDraw({ tool, onDraw, onCancel }: UseZoneDrawOptions) {
  const frame = useCanvas((state) => state.contentSize) ?? { width: 1, height: 1 };
  const scale = useCanvas((state) => state.transform.scale);
  const getRatioPoint = useCanvas((state) => state.getRatioPoint);
  const [rect, setRect] = useState<RectDrag | null>(null);
  const [vertices, setVertices] = useState<Point[]>([]);
  const [hover, setHover] = useState<Point | null>(null);

  /** In screen pixels. */
  function getScreenDistance(a: Point, b: Point) {
    return Math.hypot((a.x - b.x) * frame.width * scale, (a.y - b.y) * frame.height * scale);
  }

  const first = vertices[0];
  const isClosable =
    vertices.length >= MAP_ZONE_MIN_POINTS && !!first && !!hover && getScreenDistance(first, hover) <= ZONE_CLOSE_DISTANCE;

  function finishPolygon(points: Point[]) {
    const unique = dedupePoints(points, frame, ZONE_CLOSE_DISTANCE / scale);
    if (unique.length < MAP_ZONE_MIN_POINTS) return;
    setVertices([]);
    onDraw(unique);
  }

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (isEditable(event.target)) return;
    if (event.key === CANCEL_KEY) {
      if (vertices.length === 0 && !rect) onCancel();
      setVertices([]);
      setRect(null);
    } else if (event.key === FINISH_KEY && vertices.length > 0) {
      event.preventDefault();
      finishPolygon(vertices);
    } else if (event.key === UNDO_POINT_KEY && vertices.length > 0) {
      event.preventDefault();
      setVertices(vertices.slice(0, -1));
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const rectBind = {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0 || rect) return;
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      const start = getRatioPoint(getClientPoint(event));
      setRect({ pointerId: event.pointerId, start, end: start, isSquare: event.shiftKey });
    },
    onPointerMove: (event: ReactPointerEvent) => {
      if (rect?.pointerId !== event.pointerId) return;
      setRect({ ...rect, end: getRatioPoint(getClientPoint(event)), isSquare: event.shiftKey });
    },
    onPointerUp: (event: ReactPointerEvent) => {
      if (rect?.pointerId !== event.pointerId) return;
      setRect(null);
      const points = getRectPoints(rect.start, getRatioPoint(getClientPoint(event)), frame, event.shiftKey);
      const [start, , corner] = points;
      if (getScreenDistance({ x: start!.x, y: 0 }, { x: corner!.x, y: 0 }) < MIN_ZONE_DRAG_SIZE) return;
      if (getScreenDistance({ x: 0, y: start!.y }, { x: 0, y: corner!.y }) < MIN_ZONE_DRAG_SIZE) return;
      onDraw(points);
    },
    onPointerCancel: () => setRect(null),
  };

  const polygonBind = {
    onPointerMove: (event: ReactPointerEvent) => setHover(getRatioPoint(getClientPoint(event))),
    onPointerLeave: () => setHover(null),
    onClick: (event: MouseEvent) => {
      if (isClosable) {
        finishPolygon(vertices);
        return;
      }
      setVertices([...vertices, getRatioPoint(getClientPoint(event))]);
    },
    onDoubleClick: () => finishPolygon(vertices),
  };

  const preview = rect ? getRectPoints(rect.start, rect.end, frame, rect.isSquare) : null;

  return {
    bind: tool === CanvasTool.RECTANGLE ? rectBind : polygonBind,
    preview,
    vertices,
    hover: isClosable ? first! : hover,
    isClosable,
  };
}
