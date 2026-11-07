import type { ImageMapLayerType } from "../image-map.constants";

export function createLayerId(type: ImageMapLayerType): string {
  return `${type}-${Date.now().toString(36)}`;
}
