import { CanvasLayerType, DUPLICATE_OFFSET, LayerOrder } from "../canvas.constants";
import type { CanvasLayer, Point, Size } from "../canvas.types";
import { clamp } from "./transform.utils";
import { movePoints } from "./zone.utils";

export function createLayerId(type: CanvasLayerType): string {
  return `${type}-${crypto.randomUUID()}`;
}

export interface LayerListItem {
  layer: CanvasLayer;
  label: string;
}

/** Bottom-most first; layers of a type are drawn above the types before it. */
const DRAW_ORDER: readonly CanvasLayerType[] = [
  CanvasLayerType.IMAGE,
  CanvasLayerType.ZONE,
  CanvasLayerType.ARROW,
  CanvasLayerType.TEXT,
  CanvasLayerType.PIN,
];

function getLabel(layer: CanvasLayer, index: number): string {
  switch (layer.type) {
    case CanvasLayerType.IMAGE:
      return `Image ${index + 1}`;
    case CanvasLayerType.ARROW:
      return `Arrow ${index + 1}`;
    case CanvasLayerType.TEXT:
      return layer.text.trim() || "Text";
    default:
      return layer.label;
  }
}

/** Top-most first. */
export function toLayerList(layers: readonly CanvasLayer[]): LayerListItem[] {
  return DRAW_ORDER.flatMap((type) =>
    layers
      .filter((layer) => layer.type === type)
      .map((layer, index) => ({ layer, label: getLabel(layer, index) })),
  ).reverse();
}

export function isSameSize(a: Size, b: Size): boolean {
  return a.width === b.width && a.height === b.height;
}

/** Pins, texts, zones and arrows stay inside the frame. */
export function duplicateLayer<T extends CanvasLayer>(layer: T): T {
  const id = createLayerId(layer.type);
  const delta = { x: DUPLICATE_OFFSET, y: DUPLICATE_OFFSET };
  if (layer.type === CanvasLayerType.ZONE) return { ...layer, id, points: movePoints(layer.points, delta) };
  if (layer.type === CanvasLayerType.ARROW) {
    const [start, end] = movePoints([layer.start, layer.end], delta);
    return { ...layer, id, start, end };
  }
  const x = layer.x + DUPLICATE_OFFSET;
  const y = layer.y + DUPLICATE_OFFSET;
  const position =
    layer.type === CanvasLayerType.IMAGE ? { x: Math.min(x, 1), y: Math.min(y, 1) } : { x: clamp(x, 0, 1), y: clamp(y, 0, 1) };
  return { ...layer, ...position, id };
}

/** Uniform, so images keep their aspect ratio and texts their proportions. */
export function fitLayersToFrame(layers: readonly CanvasLayer[], from: Size, to: Size): CanvasLayer[] {
  const scale = Math.min(to.width / from.width, to.height / from.height);
  const offset = { x: (to.width - from.width * scale) / 2, y: (to.height - from.height * scale) / 2 };
  const toPoint = ({ x, y }: Point): Point => ({
    x: (x * from.width * scale + offset.x) / to.width,
    y: (y * from.height * scale + offset.y) / to.height,
  });

  return layers.map((layer): CanvasLayer => {
    switch (layer.type) {
      case CanvasLayerType.PIN:
        return { ...layer, ...toPoint(layer) };
      case CanvasLayerType.TEXT:
        return { ...layer, ...toPoint(layer), fontSize: layer.fontSize * scale };
      case CanvasLayerType.ZONE:
        return { ...layer, points: layer.points.map(toPoint) };
      case CanvasLayerType.ARROW:
        return { ...layer, start: toPoint(layer.start), end: toPoint(layer.end) };
      default:
        return {
          ...layer,
          ...toPoint(layer),
          width: (layer.width * from.width * scale) / to.width,
          height: (layer.height * from.height * scale) / to.height,
        };
    }
  });
}

/** Position among the layers of the same type, which is its drawing order; `null` when missing. */
export function getLayerPosition(layers: readonly CanvasLayer[], id: string): { index: number; count: number } | null {
  const layer = layers.find((current) => current.id === id);
  if (!layer) return null;
  const sameType = layers.filter((current) => current.type === layer.type);
  return { index: sameType.indexOf(layer), count: sameType.length };
}

/** Reorders a layer among the layers of its type; the other layers keep their place. */
export function moveLayer(layers: readonly CanvasLayer[], id: string, order: LayerOrder): CanvasLayer[] {
  const position = getLayerPosition(layers, id);
  if (!position) return [...layers];
  const { index, count } = position;
  const target = {
    [LayerOrder.FRONT]: count - 1,
    [LayerOrder.FORWARD]: Math.min(index + 1, count - 1),
    [LayerOrder.BACKWARD]: Math.max(index - 1, 0),
    [LayerOrder.BACK]: 0,
  }[order];
  const type = layers.find((layer) => layer.id === id)!.type;
  const sameType = layers.filter((layer) => layer.type === type);
  const [moved] = sameType.splice(index, 1);
  sameType.splice(target, 0, moved!);
  let next = 0;
  return layers.map((layer) => (layer.type === type ? sameType[next++]! : layer));
}
