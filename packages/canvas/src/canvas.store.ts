import { createStore } from "zustand/vanilla";
import { IDENTITY_TRANSFORM, MAX_ZOOM, MIN_ZOOM } from "./canvas.constants";
import type { Point, Size, Transform } from "./canvas.types";
import {
  clamp,
  clampOffset,
  fitTransform,
  getFitScale,
  toContentPoint,
  toRatioPoint,
  zoomAt,
} from "./utils/transform.utils";

export interface CanvasState {
  viewport: HTMLElement | null;
  viewportSize: Size | null;
  contentSize: Size | null;
  transform: Transform;
  isFitted: boolean;
  selectedLayerId: string | null;
  isAddingPin: boolean;
}

export interface CanvasActions {
  setViewport: (viewport: HTMLElement | null) => void;
  setViewportSize: (size: Size) => void;
  setContentSize: (size: Size | null) => void;
  /** Clamps the scale and offset, and stops refitting. */
  setTransform: (transform: Transform) => void;
  /** `origin` is a viewport point, the center by default. */
  zoomTo: (scale: number, origin?: Point) => void;
  zoomBy: (factor: number) => void;
  panBy: (x: number, y: number) => void;
  reset: () => void;
  selectLayer: (id: string | null) => void;
  setIsAddingPin: (isAddingPin: boolean) => void;
  getViewportPoint: (client: Point) => Point;
  getContentPoint: (client: Point) => Point;
  /** Maps a client point to ratios of the content size, from 0 to 1. */
  getRatioPoint: (client: Point) => Point;
}

export type CanvasStore = CanvasState & CanvasActions;
export type CanvasStoreApi = ReturnType<typeof createCanvasStore>;

export function getScaleRange({ viewportSize, contentSize }: CanvasState) {
  const fitScale =
    viewportSize && contentSize ? getFitScale(viewportSize, contentSize) : 1;
  return {
    fitScale,
    minScale: fitScale * MIN_ZOOM,
    maxScale: fitScale * MAX_ZOOM,
  };
}

export const selectIsReady = (state: CanvasState) =>
  Boolean(state.viewportSize && state.contentSize);
export const selectZoom = (state: CanvasState) =>
  state.transform.scale / getScaleRange(state).fitScale;
export const selectCanZoomIn = (state: CanvasState) =>
  state.transform.scale < getScaleRange(state).maxScale;
export const selectCanZoomOut = (state: CanvasState) =>
  state.transform.scale > getScaleRange(state).minScale;

function fit({
  viewportSize,
  contentSize,
}: Pick<CanvasState, "viewportSize" | "contentSize">) {
  if (!viewportSize || !contentSize) return { isFitted: true };
  return { transform: fitTransform(viewportSize, contentSize), isFitted: true };
}

/** An empty size (e.g. a collapsed viewport) cannot be fitted. */
function toValidSize(size: Size | null): Size | null {
  return size && size.width > 0 && size.height > 0 ? size : null;
}

export function createCanvasStore() {
  return createStore<CanvasStore>()((set, get) => ({
    viewport: null,
    viewportSize: null,
    contentSize: null,
    transform: IDENTITY_TRANSFORM,
    isFitted: true,
    selectedLayerId: null,
    isAddingPin: false,

    setViewport: (viewport) => set({ viewport }),
    setViewportSize: (size) =>
      set((state) => {
        const viewportSize = toValidSize(size);
        return state.isFitted
          ? { viewportSize, ...fit({ ...state, viewportSize }) }
          : { viewportSize };
      }),
    setContentSize: (size) =>
      set((state) => {
        const contentSize = toValidSize(size);
        return { contentSize, ...fit({ ...state, contentSize }) };
      }),

    setTransform: (next) =>
      set((state) => {
        const { viewportSize, contentSize } = state;
        if (!viewportSize || !contentSize) return {};
        const { minScale, maxScale } = getScaleRange(state);
        const scaled = {
          ...next,
          scale: clamp(next.scale, minScale, maxScale),
        };
        return {
          transform: clampOffset(scaled, viewportSize, contentSize),
          isFitted: false,
        };
      }),
    zoomTo: (scale, origin) => {
      const state = get();
      if (!state.viewportSize) return;
      const { minScale, maxScale } = getScaleRange(state);
      const center = origin ?? {
        x: state.viewportSize.width / 2,
        y: state.viewportSize.height / 2,
      };
      state.setTransform(
        zoomAt(state.transform, clamp(scale, minScale, maxScale), center),
      );
    },
    zoomBy: (factor) => get().zoomTo(get().transform.scale * factor),
    panBy: (x, y) => {
      const { transform, setTransform } = get();
      setTransform({ ...transform, x: transform.x + x, y: transform.y + y });
    },
    reset: () => set(fit),
    selectLayer: (selectedLayerId) => set({ selectedLayerId }),
    setIsAddingPin: (isAddingPin) => set({ isAddingPin }),

    getViewportPoint: (client) => {
      const rect = get().viewport?.getBoundingClientRect();
      return rect
        ? { x: client.x - rect.left, y: client.y - rect.top }
        : client;
    },
    getContentPoint: (client) =>
      toContentPoint(get().transform, get().getViewportPoint(client)),
    getRatioPoint: (client) => {
      const { contentSize, getContentPoint } = get();
      return contentSize
        ? toRatioPoint(getContentPoint(client), contentSize)
        : { x: 0, y: 0 };
    },
  }));
}
