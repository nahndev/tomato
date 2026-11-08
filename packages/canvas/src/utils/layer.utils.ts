import { CanvasLayerType, DUPLICATE_OFFSET, IMAGE_LABEL_PREFIX } from "../canvas.constants";
import type { CanvasLayer, Point, Size } from "../canvas.types";
import { clamp } from "./transform.utils";

export function createLayerId(type: CanvasLayerType): string {
  return `${type}-${crypto.randomUUID()}`;
}

export interface LayerListItem {
  layer: CanvasLayer;
  label: string;
}

/** Top-most first: pins are drawn above images. */
export function toLayerList(layers: readonly CanvasLayer[]): LayerListItem[] {
  const images: LayerListItem[] = [];
  const pins: LayerListItem[] = [];
  for (const layer of layers) {
    if (layer.type === CanvasLayerType.PIN) pins.push({ layer, label: layer.label });
    else images.push({ layer, label: `${IMAGE_LABEL_PREFIX}${images.length + 1}` });
  }
  return [...pins.reverse(), ...images.reverse()];
}

export function isSameSize(a: Size, b: Size): boolean {
  return a.width === b.width && a.height === b.height;
}

/** Pins stay inside the frame. */
export function duplicateLayer<T extends CanvasLayer>(layer: T): T {
  const x = layer.x + DUPLICATE_OFFSET;
  const y = layer.y + DUPLICATE_OFFSET;
  const position = layer.type === CanvasLayerType.PIN ? { x: clamp(x, 0, 1), y: clamp(y, 0, 1) } : { x: Math.min(x, 1), y: Math.min(y, 1) };
  return { ...layer, ...position, id: createLayerId(layer.type) };
}

/** Uniform, so images keep their aspect ratio. */
export function fitLayersToFrame(layers: readonly CanvasLayer[], from: Size, to: Size): CanvasLayer[] {
  const scale = Math.min(to.width / from.width, to.height / from.height);
  const offset = { x: (to.width - from.width * scale) / 2, y: (to.height - from.height * scale) / 2 };
  const toPoint = ({ x, y }: Point): Point => ({
    x: (x * from.width * scale + offset.x) / to.width,
    y: (y * from.height * scale + offset.y) / to.height,
  });

  return layers.map((layer): CanvasLayer => {
    if (layer.type === CanvasLayerType.PIN) return { ...layer, ...toPoint(layer) };
    return {
      ...layer,
      ...toPoint(layer),
      width: (layer.width * from.width * scale) / to.width,
      height: (layer.height * from.height * scale) / to.height,
    };
  });
}
