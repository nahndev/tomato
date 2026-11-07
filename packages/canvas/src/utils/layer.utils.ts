import type { CanvasLayerType } from "../canvas.constants";

export function createLayerId(type: CanvasLayerType): string {
  return `${type}-${Date.now().toString(36)}`;
}
