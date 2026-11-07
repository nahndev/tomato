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
  const { id, fileId, x, y, width, height } = layer;
  return { type: CanvasLayerType.IMAGE, id, src: getFileContentUrl(fileId), alt, x, y, width, height, ...toLock(layer) };
}

/** Drops images whose `src` is not a storage file URL. */
function toMapLayers(layer: CanvasLayer): MapLayer[] {
  if (layer.type === CanvasLayerType.PIN) {
    const { id, label, description, x, y } = layer;
    return [{ type: MapLayerType.PIN, id, label, description, x, y, ...toLock(layer) }];
  }
  const fileId = getFileIdFromContentUrl(layer.src);
  if (!fileId) return [];
  const { id, x, y, width, height } = layer;
  return [{ type: MapLayerType.IMAGE, id, fileId, x, y, width, height, ...toLock(layer) }];
}

/** Images get their file URL as `src` and `alt` as alt text. */
export function toCanvasValue({ frame, layers, viewport }: MapValue, alt: string): CanvasValue {
  return { frame: frame ?? MAP_FRAME_DEFAULT_SIZE, layers: layers.map((layer) => toCanvasLayer(layer, alt)), viewport };
}

export function fromCanvasValue({ frame, layers, viewport }: CanvasValue): MapValue {
  return { frame: { width: frame.width, height: frame.height }, layers: layers.flatMap(toMapLayers), viewport };
}

/** Everything but position and size: id, lock and pin details. */
function getLayerKey(layer: MapLayer): string {
  const details = layer.type === MapLayerType.PIN ? `:${layer.label}:${layer.description}` : "";
  return `${layer.id}:${Boolean(layer.isLocked)}${details}`;
}

/** Frame and layer list changes (add, delete, lock, pin edits) are saved at once; moves and zooms are debounced. */
export function shouldSaveNow(current: MapValue, next: MapValue): boolean {
  const frame = current.frame ?? MAP_FRAME_DEFAULT_SIZE;
  if (next.frame && (next.frame.width !== frame.width || next.frame.height !== frame.height)) return true;
  return (
    current.layers.length !== next.layers.length ||
    current.layers.some((layer, index) => getLayerKey(layer) !== getLayerKey(next.layers[index]!))
  );
}
