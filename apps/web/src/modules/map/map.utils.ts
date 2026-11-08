import { getFileContentUrl, getFileIdFromContentUrl } from "@/modules/file";
import { CanvasLayerType, type CanvasLayer, type CanvasValue } from "@tomato/canvas";
import { MAP_FRAME_DEFAULT_SIZE, MapLayerType } from "@tomato/constants";
import type { MapImageLayer, MapLayer, MapValue } from "@tomato/types";

export function getFirstImage({ layers }: MapValue): MapImageLayer | undefined {
  return layers.find((layer): layer is MapImageLayer => layer.type === MapLayerType.IMAGE);
}

function toLock({ isLocked }: { isLocked?: boolean }): Pick<MapLayer, "isLocked"> {
  return isLocked ? { isLocked } : {};
}

function toCanvasLayer(layer: MapLayer, alt: string): CanvasLayer {
  if (layer.type === MapLayerType.PIN) return layer;
  if (layer.type === MapLayerType.ZONE) return { ...layer, type: CanvasLayerType.ZONE };
  const { id, fileId, x, y, width, height } = layer;
  return { type: CanvasLayerType.IMAGE, id, src: getFileContentUrl(fileId), alt, x, y, width, height, ...toLock(layer) };
}

function toMapLayers(layer: CanvasLayer): MapLayer[] {
  if (layer.type === CanvasLayerType.PIN) {
    const { id, label, description, x, y, color } = layer;
    return [{ type: MapLayerType.PIN, id, label, description, x, y, ...(color && { color }), ...toLock(layer) }];
  }
  if (layer.type === CanvasLayerType.ZONE) {
    const { id, label, description, points, color } = layer;
    const zonePoints = points.map(({ x, y }) => ({ x, y }));
    return [{ type: MapLayerType.ZONE, id, label, description, points: zonePoints, ...(color && { color }), ...toLock(layer) }];
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
