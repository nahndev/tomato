import {
  useEffect,
  useEffectEvent,
  useState,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useCanvas } from "../components/state-provider";
import { MAP_ZONE_MIN_POINTS } from "@tomato/constants";
import {
  CanvasTool,
  MIN_ZONE_DRAG_SIZE,
  ZONE_CLOSE_DISTANCE,
} from "../canvas.constants";
import type { Point } from "../canvas.types";
import { isEditable } from "../utils/event.utils";
import { getClientPoint } from "../utils/transform.utils";
import {
  dedupePoints,
  getArrowPoints,
  getEllipsePoints,
  getRectPoints,
} from "../utils/zone.utils";

export type ShapeDrawTool =
  | typeof CanvasTool.RECTANGLE
  | typeof CanvasTool.ELLIPSE
  | typeof CanvasTool.POLYGON
  | typeof CanvasTool.ARROW;

export const SHAPE_DRAW_TOOLS: readonly CanvasTool[] = [
  CanvasTool.RECTANGLE,
  CanvasTool.ELLIPSE,
  CanvasTool.POLYGON,
  CanvasTool.ARROW,
] satisfies readonly ShapeDrawTool[];

export function isShapeDrawTool(tool: CanvasTool): tool is ShapeDrawTool {
  return SHAPE_DRAW_TOOLS.includes(tool);
}

interface UseShapeDrawOptions {
  tool: ShapeDrawTool;
  /** Polygon vertices, or the arrow's start and end. */
  onDraw: (points: Point[]) => void;
  onCancel: () => void;
}

interface RectDrag {
  pointerId: number;
  start: Point;
  end: Point;
  /** Shift: squares, circles and arrows snapped to 45°. */
  isSquare: boolean;
}

export function useShapeDraw({ tool, onDraw, onCancel }: UseShapeDrawOptions) {
  const frame = useCanvas((state) => state.contentSize) ?? {
    width: 1,
    height: 1,
  };
  const scale = useCanvas((state) => state.transform.scale);
  const getRatioPoint = useCanvas((state) => state.getRatioPoint);
  const [rect, setRect] = useState<RectDrag | null>(null);
  const [vertices, setVertices] = useState<Point[]>([]);
  const [hover, setHover] = useState<Point | null>(null);

  /** In screen pixels. */
  function getScreenDistance(a: Point, b: Point) {
    return Math.hypot(
      (a.x - b.x) * frame.width * scale,
      (a.y - b.y) * frame.height * scale,
    );
  }

  const first = vertices[0];
  const isClosable =
    vertices.length >= MAP_ZONE_MIN_POINTS &&
    !!first &&
    !!hover &&
    getScreenDistance(first, hover) <= ZONE_CLOSE_DISTANCE;
  /** Hovered vertex; clicking it removes it and every vertex after it. */
  const rewindIndex =
    !isClosable && hover
      ? vertices.reduce(
          (found, point, index) =>
            getScreenDistance(point, hover) <= ZONE_CLOSE_DISTANCE
              ? index
              : found,
          -1,
        )
      : -1;

  function getDragPoints(start: Point, end: Point, isSquare: boolean): Point[] {
    if (tool === CanvasTool.ARROW)
      return getArrowPoints(start, end, frame, isSquare);
    if (tool === CanvasTool.ELLIPSE)
      return getEllipsePoints(start, end, frame, isSquare);
    return getRectPoints(start, end, frame, isSquare);
  }

  /** Arrows need some length, other shapes some width and height. */
  function isTooSmall(points: readonly Point[]): boolean {
    if (tool === CanvasTool.ARROW)
      return getScreenDistance(points[0]!, points[1]!) < MIN_ZONE_DRAG_SIZE;
    const xs = points.map(({ x }) => x);
    const ys = points.map(({ y }) => y);
    return (
      getScreenDistance(
        { x: Math.min(...xs), y: 0 },
        { x: Math.max(...xs), y: 0 },
      ) < MIN_ZONE_DRAG_SIZE ||
      getScreenDistance(
        { x: 0, y: Math.min(...ys) },
        { x: 0, y: Math.max(...ys) },
      ) < MIN_ZONE_DRAG_SIZE
    );
  }

  function finishPolygon(points: Point[]) {
    const unique = dedupePoints(points, frame, ZONE_CLOSE_DISTANCE / scale);
    if (unique.length < MAP_ZONE_MIN_POINTS) return;
    setVertices([]);
    onDraw(unique);
  }

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (isEditable(event.target)) return;
    if (event.key === "Escape") {
      if (vertices.length === 0 && !rect) onCancel();
      setVertices([]);
      setRect(null);
    } else if (event.key === "Enter" && vertices.length > 0) {
      event.preventDefault();
      finishPolygon(vertices);
    } else if (event.key === "Backspace" && vertices.length > 0) {
      event.preventDefault();
      setVertices(vertices.slice(0, -1));
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const dragBind = {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0 || rect) return;
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      const start = getRatioPoint(getClientPoint(event));
      setRect({
        pointerId: event.pointerId,
        start,
        end: start,
        isSquare: event.shiftKey,
      });
    },
    onPointerMove: (event: ReactPointerEvent) => {
      if (rect?.pointerId !== event.pointerId) return;
      setRect({
        ...rect,
        end: getRatioPoint(getClientPoint(event)),
        isSquare: event.shiftKey,
      });
    },
    onPointerUp: (event: ReactPointerEvent) => {
      if (rect?.pointerId !== event.pointerId) return;
      setRect(null);
      const points = getDragPoints(
        rect.start,
        getRatioPoint(getClientPoint(event)),
        event.shiftKey,
      );
      if (!isTooSmall(points)) onDraw(points);
    },
    onPointerCancel: () => setRect(null),
  };

  const polygonBind = {
    onPointerMove: (event: ReactPointerEvent) =>
      setHover(getRatioPoint(getClientPoint(event))),
    onPointerLeave: () => setHover(null),
    onClick: (event: MouseEvent) => {
      if (isClosable) {
        finishPolygon(vertices);
        return;
      }
      // The second click of a double-click lands on the vertex it just added.
      if (rewindIndex !== -1 && event.detail === 1) {
        setVertices(vertices.slice(0, rewindIndex));
        return;
      }
      setVertices([...vertices, getRatioPoint(getClientPoint(event))]);
    },
    onDoubleClick: () => finishPolygon(vertices),
  };

  const preview = rect
    ? getDragPoints(rect.start, rect.end, rect.isSquare)
    : null;

  return {
    bind: tool === CanvasTool.POLYGON ? polygonBind : dragBind,
    preview,
    vertices,
    hover: isClosable ? first! : hover,
    isClosable,
    rewindIndex,
  };
}
