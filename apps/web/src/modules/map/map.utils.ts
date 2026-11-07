import { getFileContentUrl } from "@/modules/file";
import { fetchImageSize, fitImageRect, ImageMapLayerType, type ImageMapLayer } from "@tomato/image-map";
import { MapLayerType } from "@tomato/constants";
import type { MapImageLayer, MapLayer, MapPinLayer, MapValue } from "@tomato/types";
import { MAP_FRAME_SIZE } from "./map.constants";

export function createLayerId(type: MapLayerType): string {
  return `${type}-${Date.now().toString(36)}`;
}

export function getFirstImage({ layers }: MapValue): MapImageLayer | undefined {
  return layers.find((layer): layer is MapImageLayer => layer.type === MapLayerType.IMAGE);
}

export function getPins({ layers }: MapValue): MapPinLayer[] {
  return layers.filter((layer): layer is MapPinLayer => layer.type === MapLayerType.PIN);
}

/** Fitted and centered in the frame. */
export async function createImageLayer(fileId: string): Promise<MapImageLayer> {
  const size = await fetchImageSize(getFileContentUrl(fileId));
  return { type: MapLayerType.IMAGE, id: createLayerId(MapLayerType.IMAGE), fileId, ...fitImageRect(size, MAP_FRAME_SIZE) };
}

export function toImageMapLayers(layers: MapLayer[], alt: string): ImageMapLayer[] {
  return layers.map((layer) =>
    layer.type === MapLayerType.IMAGE
      ? { ...layer, type: ImageMapLayerType.IMAGE, src: getFileContentUrl(layer.fileId), alt }
      : layer,
  );
}

/** Keeps stored files and pin details; names new pins in order. */
export function fromImageMapLayers(next: readonly ImageMapLayer[], stored: MapLayer[]): MapLayer[] {
  const byId = new Map(stored.map((layer) => [layer.id, layer]));
  let pinCount = 0;
  return next.flatMap((layer): MapLayer[] => {
    const current = byId.get(layer.id);
    if (layer.type === ImageMapLayerType.IMAGE) {
      if (current?.type !== MapLayerType.IMAGE) return [];
      const { x, y, width, height } = layer;
      return [{ ...current, x, y, width, height }];
    }
    pinCount += 1;
    const pin = current?.type === MapLayerType.PIN ? current : { description: "", label: `Pin ${pinCount}` };
    return [{ ...pin, type: MapLayerType.PIN, id: layer.id, x: layer.x, y: layer.y }];
  });
}
