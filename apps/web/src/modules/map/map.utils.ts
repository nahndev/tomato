import { getFileContentUrl, getFileIdFromContentUrl } from "@/modules/file";
import { CanvasLayerType, type CanvasLayer, type CanvasValue } from "@tomato/canvas";
import { MAP_FRAME_DEFAULT_SIZE, MapLayerType } from "@tomato/constants";
import type { MapImageLayer, MapLayer, MapPoint, MapValue } from "./map.types";

export function getFirstImage({ layers }: MapValue): MapImageLayer | undefined {
  return layers.find((layer): layer is MapImageLayer => layer.type === MapLayerType.IMAGE);
}

function toLock({ isLocked }: { isLocked?: boolean }): Pick<MapLayer, "isLocked"> {
  return isLocked ? { isLocked } : {};
}

function toColor({ color }: { color?: string }): { color?: string } {
  return color ? { color } : {};
}

function toCanvasLayer(layer: MapLayer, alt: string): CanvasLayer {
  if (layer.type === MapLayerType.PIN) return layer;
  if (layer.type === MapLayerType.ZONE) return { ...layer, type: CanvasLayerType.ZONE };
  if (layer.type === MapLayerType.TEXT) return { ...layer, type: CanvasLayerType.TEXT };
  if (layer.type === MapLayerType.ARROW) return { ...layer, type: CanvasLayerType.ARROW };
  const { id, fileId, x, y, width, height } = layer;
  return { type: CanvasLayerType.IMAGE, id, src: getFileContentUrl(fileId), alt, x, y, width, height, ...toLock(layer) };
}

function toPoint({ x, y }: MapPoint): MapPoint {
  return { x, y };
}

/** Texts still empty while first typed are left out. */
function toMapLayers(layer: CanvasLayer): MapLayer[] {
  if (layer.type === CanvasLayerType.PIN) {
    const { id, label, description, x, y, icon } = layer;
    return [{ type: MapLayerType.PIN, id, label, description, x, y, ...toColor(layer), ...(icon && { icon }), ...toLock(layer) }];
  }
  if (layer.type === CanvasLayerType.ZONE) {
    const { id, label, description, points } = layer;
    return [{ type: MapLayerType.ZONE, id, label, description, points: points.map(toPoint), ...toColor(layer), ...toLock(layer) }];
  }
  if (layer.type === CanvasLayerType.TEXT) {
    const { id, text, x, y, fontSize } = layer;
    if (!text.trim()) return [];
    return [{ type: MapLayerType.TEXT, id, text, x, y, fontSize, ...toColor(layer), ...toLock(layer) }];
  }
  if (layer.type === CanvasLayerType.ARROW) {
    const { id, start, end } = layer;
    return [{ type: MapLayerType.ARROW, id, start: toPoint(start), end: toPoint(end), ...toColor(layer), ...toLock(layer) }];
  }
  const fileId = getFileIdFromContentUrl(layer.src);
  if (!fileId) return [];
  const { id, x, y, width, height } = layer;
  return [{ type: MapLayerType.IMAGE, id, fileId, x, y, width, height, ...toLock(layer) }];
}

export function toCanvasValue({ frame, layers, viewport }: MapValue, alt: string): CanvasValue {
  return { frame: frame ?? MAP_FRAME_DEFAULT_SIZE, layers: layers.map((layer) => toCanvasLayer(layer, alt)), viewport };
}

export function fromCanvasValue({ frame, layers, viewport }: CanvasValue): MapValue {
  return { frame: { width: frame.width, height: frame.height }, layers: layers.flatMap(toMapLayers), viewport };
}

function getLayerKey(layer: MapLayer): string {
  return `${layer.id}:${Boolean(layer.isLocked)}`;
}

export function shouldSaveNow(current: MapValue, next: MapValue): boolean {
  const frame = current.frame ?? MAP_FRAME_DEFAULT_SIZE;
  if (next.frame && (next.frame.width !== frame.width || next.frame.height !== frame.height)) return true;
  return (
    current.layers.length !== next.layers.length ||
    current.layers.some((layer, index) => getLayerKey(layer) !== getLayerKey(next.layers[index]!))
  );
}
