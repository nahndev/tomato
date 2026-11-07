import { getFileContentUrl, getFileIdFromContentUrl } from "@/modules/file";
import { CanvasLayerType, type CanvasLayer } from "@tomato/canvas";
import { MapLayerType } from "@tomato/constants";
import type { MapImageLayer, MapLayer, MapValue } from "@tomato/types";

export function getFirstImage({ layers }: MapValue): MapImageLayer | undefined {
  return layers.find((layer): layer is MapImageLayer => layer.type === MapLayerType.IMAGE);
}

export function toCanvasLayers(layers: MapLayer[], alt: string): CanvasLayer[] {
  return layers.map((layer): CanvasLayer => {
    if (layer.type === MapLayerType.PIN) return layer;
    const { id, fileId, x, y, width, height } = layer;
    return { type: CanvasLayerType.IMAGE, id, src: getFileContentUrl(fileId), alt, x, y, width, height };
  });
}

/** Drops images whose `src` is not a storage file URL. */
export function fromCanvasLayers(layers: readonly CanvasLayer[]): MapLayer[] {
  return layers.flatMap((layer): MapLayer[] => {
    if (layer.type === CanvasLayerType.PIN) {
      const { id, label, description, x, y } = layer;
      return [{ type: MapLayerType.PIN, id, label, description, x, y }];
    }
    const fileId = getFileIdFromContentUrl(layer.src);
    if (!fileId) return [];
    const { id, x, y, width, height } = layer;
    return [{ type: MapLayerType.IMAGE, id, fileId, x, y, width, height }];
  });
}

function getDetailsKey(layer: MapLayer): string {
  return layer.type === MapLayerType.PIN ? `${layer.id}:${layer.label}:${layer.description}` : layer.id;
}

/** Added, removed or renamed layers are saved at once; moves and zooms are debounced. */
export function isLayerListChange(current: MapLayer[], next: MapLayer[]): boolean {
  return current.length !== next.length || current.some((layer, index) => getDetailsKey(layer) !== getDetailsKey(next[index]!));
}
