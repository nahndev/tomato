import { cn } from "@tomato/ui";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  DEFAULT_MAX_ZOOM,
  DEFAULT_MIN_ZOOM,
  DRAG_THRESHOLD,
  IDENTITY_TRANSFORM,
  WHEEL_ZOOM_SPEED,
  ZOOM_STEP,
} from "./image-map.constants";
import type { Point, Size, Transform } from "./image-map.types";
import {
  clamp,
  clampOffset,
  fitTransform,
  getDistance,
  getFitScale,
  getMidpoint,
  toContentPoint,
  zoomAt,
} from "./transform.utils";

const KEYBOARD_PAN_STEP = 40;
const WHEEL_LINE_HEIGHT = 16;

class TransformContextMissingError extends Error {
  constructor() {
    super("useTransform must be used inside <TransformWrapper>");
  }
}

export interface TransformContextValue {
  transform: Transform;
  /** Current scale relative to the fitted scale. */
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  /** Maps a client point (e.g. `event.clientX/Y`) to content coordinates. */
  getContentPoint: (client: Point) => Point;
}

const TransformContext = createContext<TransformContextValue | null>(null);

export function useTransform(): TransformContextValue {
  const value = useContext(TransformContext);
  if (!value) throw new TransformContextMissingError();
  return value;
}

interface Gesture {
  start: Transform;
  startPoints: Point[];
  isDragging: boolean;
}

interface TransformWrapperProps {
  /** Natural size of the content; `null` while unknown (the content is hidden). */
  contentSize: Size | null;
  minZoom?: number;
  maxZoom?: number;
  /** Rendered over the viewport, outside the transformed content. */
  overlay?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function TransformWrapper({
  contentSize,
  minZoom = DEFAULT_MIN_ZOOM,
  maxZoom = DEFAULT_MAX_ZOOM,
  overlay,
  className,
  children,
}: TransformWrapperProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState<Size | null>(null);
  const [transform, setTransform] = useState<Transform>(IDENTITY_TRANSFORM);
  const transformRef = useRef<Transform>(IDENTITY_TRANSFORM);
  // Until the user zooms or pans, the content refits on every resize.
  const [isFitted, setIsFitted] = useState(true);
  const pointersRef = useRef(new Map<number, Point>());
  const gestureRef = useRef<Gesture | null>(null);
  const hasDraggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const fitScale =
    viewportSize && contentSize ? getFitScale(viewportSize, contentSize) : 1;
  const minScale = fitScale * minZoom;
  const maxScale = fitScale * maxZoom;

  const commit = useCallback(
    (next: Transform) => {
      if (!viewportSize || !contentSize) return;
      const bounded = clampOffset(
        { ...next, scale: clamp(next.scale, minScale, maxScale) },
        viewportSize,
        contentSize,
      );
      transformRef.current = bounded;
      setTransform(bounded);
      setIsFitted(false);
    },
    [viewportSize, contentSize, minScale, maxScale],
  );

  const zoomAround = useCallback(
    (scale: number, origin: Point) => {
      commit(zoomAt(transformRef.current, clamp(scale, minScale, maxScale), origin));
    },
    [commit, minScale, maxScale],
  );

  const zoomByStep = useCallback(
    (factor: number) => {
      if (!viewportSize) return;
      zoomAround(transformRef.current.scale * factor, {
        x: viewportSize.width / 2,
        y: viewportSize.height / 2,
      });
    },
    [viewportSize, zoomAround],
  );

  const getViewportPoint = useCallback((client: Point): Point => {
    const rect = viewportRef.current?.getBoundingClientRect();
    return rect ? { x: client.x - rect.left, y: client.y - rect.top } : client;
  }, []);

  const reset = useCallback(() => {
    if (!viewportSize || !contentSize) return;
    const fitted = fitTransform(viewportSize, contentSize);
    transformRef.current = fitted;
    setTransform(fitted);
    setIsFitted(true);
  }, [viewportSize, contentSize]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setViewportSize({ width, height });
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isFitted) reset();
  }, [isFitted, reset]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    // React registers wheel listeners as passive, which cannot prevent page scroll.
    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      const delta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? event.deltaY * WHEEL_LINE_HEIGHT
          : event.deltaY;
      zoomAround(
        transformRef.current.scale * Math.exp(-delta * WHEEL_ZOOM_SPEED),
        getViewportPoint({ x: event.clientX, y: event.clientY }),
      );
    }
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [zoomAround, getViewportPoint]);

  function startGesture() {
    gestureRef.current = {
      start: transformRef.current,
      startPoints: [...pointersRef.current.values()],
      isDragging: gestureRef.current?.isDragging ?? false,
    };
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (pointersRef.current.size === 0) hasDraggedRef.current = false;
    pointersRef.current.set(event.pointerId, getViewportPoint({ x: event.clientX, y: event.clientY }));
    startGesture();
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture || !pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, getViewportPoint({ x: event.clientX, y: event.clientY }));
    const points = [...pointersRef.current.values()];
    const [first, second] = points;
    const [startFirst, startSecond] = gesture.startPoints;
    if (!first || !startFirst) return;

    if (!gesture.isDragging) {
      if (getDistance(first, startFirst) < DRAG_THRESHOLD && !second) return;
      gesture.isDragging = true;
      hasDraggedRef.current = true;
      setIsDragging(true);
      // Captured only once dragging, so a plain click still reaches the content.
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (second && startSecond) {
      const startMidpoint = getMidpoint(startFirst, startSecond);
      const midpoint = getMidpoint(first, second);
      const scale = clamp(
        (gesture.start.scale * getDistance(first, second)) / getDistance(startFirst, startSecond),
        minScale,
        maxScale,
      );
      const zoomed = zoomAt(gesture.start, scale, startMidpoint);
      commit({
        scale,
        x: zoomed.x + midpoint.x - startMidpoint.x,
        y: zoomed.y + midpoint.y - startMidpoint.y,
      });
      return;
    }

    commit({
      scale: gesture.start.scale,
      x: gesture.start.x + first.x - startFirst.x,
      y: gesture.start.y + first.y - startFirst.y,
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size === 0) {
      gestureRef.current = null;
      setIsDragging(false);
      return;
    }
    startGesture();
  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!hasDraggedRef.current) return;
    hasDraggedRef.current = false;
    event.stopPropagation();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const current = transformRef.current;
    const pan = (x: number, y: number) => commit({ ...current, x: current.x + x, y: current.y + y });
    const actions: Record<string, () => void> = {
      "+": () => zoomByStep(ZOOM_STEP),
      "=": () => zoomByStep(ZOOM_STEP),
      "-": () => zoomByStep(1 / ZOOM_STEP),
      "0": reset,
      ArrowLeft: () => pan(KEYBOARD_PAN_STEP, 0),
      ArrowRight: () => pan(-KEYBOARD_PAN_STEP, 0),
      ArrowUp: () => pan(0, KEYBOARD_PAN_STEP),
      ArrowDown: () => pan(0, -KEYBOARD_PAN_STEP),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  const value = useMemo<TransformContextValue>(
    () => ({
      transform,
      zoom: transform.scale / fitScale,
      canZoomIn: transform.scale < maxScale,
      canZoomOut: transform.scale > minScale,
      zoomIn: () => zoomByStep(ZOOM_STEP),
      zoomOut: () => zoomByStep(1 / ZOOM_STEP),
      reset,
      getContentPoint: (client) => toContentPoint(transformRef.current, getViewportPoint(client)),
    }),
    [transform, fitScale, minScale, maxScale, zoomByStep, reset, getViewportPoint],
  );

  const isReady = Boolean(contentSize && viewportSize);

  return (
    <TransformContext.Provider value={value}>
      <div
        ref={viewportRef}
        tabIndex={0}
        role="application"
        aria-roledescription="zoomable content"
        className={cn(
          "relative touch-none overflow-hidden select-none focus-ring",
          isDragging ? "cursor-grabbing" : "cursor-grab",
          className,
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
        onKeyDown={handleKeyDown}
      >
        <div
          className={cn("absolute top-0 left-0 origin-top-left", !isReady && "invisible")}
          style={{
            width: contentSize?.width,
            height: contentSize?.height,
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}
        >
          {children}
        </div>
        {overlay}
      </div>
    </TransformContext.Provider>
  );
}
