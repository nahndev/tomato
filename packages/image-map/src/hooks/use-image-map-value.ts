import { useLayoutEffect, useRef } from "react";
import { ImageMapLayerType, NEW_PIN_ID_PREFIX } from "../image-map.constants";
import type { ImageMapPinLayer, ImageMapValue, ImageMapViewport, Point, Rect } from "../image-map.types";
import { useTransformSync } from "./use-transform-sync";

/** Turns the map's interactions into new values for a controlled `ImageMap`. */
export function useImageMapValue(value: ImageMapValue, onChangeValue?: (value: ImageMapValue) => void) {
  // Changes fired before the next render build on each other.
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  function change(update: (current: ImageMapValue) => ImageMapValue) {
    valueRef.current = update(valueRef.current);
    onChangeValue?.(valueRef.current);
  }

  function changeViewport(patch: Partial<ImageMapViewport>) {
    change((current) => ({ ...current, viewport: { ...current.viewport, ...patch } }));
  }

  useTransformSync(value.viewport.transform, (transform) => changeViewport({ transform }));

  function selectLayer(selectedLayerId: string | null) {
    changeViewport({ selectedLayerId });
  }

  /** Adds a pin while `isAddingPin`, otherwise clears the selection. */
  function clickPoint(point: Point) {
    if (!valueRef.current.viewport.isAddingPin) {
      selectLayer(null);
      return;
    }
    const pin: ImageMapPinLayer = { type: ImageMapLayerType.PIN, id: `${NEW_PIN_ID_PREFIX}${Date.now()}`, label: "", ...point };
    change((current) => ({
      ...current,
      layers: [...current.layers, pin],
      viewport: { ...current.viewport, isAddingPin: false, selectedLayerId: pin.id },
    }));
  }

  function movePin(id: string, point: Point) {
    change((current) => ({
      ...current,
      layers: current.layers.map((layer) =>
        layer.type === ImageMapLayerType.PIN && layer.id === id ? { ...layer, ...point } : layer,
      ),
    }));
  }

  function changeImage(id: string, rect: Rect) {
    change((current) => ({
      ...current,
      layers: current.layers.map((layer) =>
        layer.type === ImageMapLayerType.IMAGE && layer.id === id ? { ...layer, ...rect } : layer,
      ),
    }));
  }

  return { selectLayer, clickPoint, movePin, changeImage };
}
