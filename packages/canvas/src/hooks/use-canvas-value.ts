import { useLayoutEffect, useRef } from "react";
import type { CanvasStoreApi } from "../canvas.store";
import { CanvasLayerType, NEW_PIN_LABEL_PREFIX } from "../canvas.constants";
import type {
  CanvasImageLayer,
  CanvasLayer,
  CanvasPinDetails,
  CanvasPinLayer,
  CanvasValue,
  Point,
  Rect,
} from "../canvas.types";
import { createLayerId } from "../utils/layer.utils";
import { useTransformSync } from "./use-transform-sync";

export type CanvasValueActions = ReturnType<typeof useCanvasValue>;

/** Turns the map's interactions into new values for a controlled `Canvas`. */
export function useCanvasValue(
  store: CanvasStoreApi,
  value: CanvasValue,
  onChangeValue?: (value: CanvasValue) => void,
) {
  // Changes fired before the next render build on each other.
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  function change(update: (current: CanvasValue) => CanvasValue) {
    valueRef.current = update(valueRef.current);
    onChangeValue?.(valueRef.current);
  }

  function changeLayers(update: (layers: readonly CanvasLayer[]) => CanvasLayer[]) {
    change((current) => ({ ...current, layers: update(current.layers) }));
  }

  useTransformSync(store, value.viewport.transform, (transform) =>
    change((current) => ({ ...current, viewport: { ...current.viewport, transform } })),
  );

  function addLayer(layer: CanvasLayer) {
    changeLayers((layers) => [...layers, layer]);
    store.getState().selectLayer(layer.id);
  }

  function removeLayer(id: string) {
    changeLayers((layers) => layers.filter((layer) => layer.id !== id));
    const { selectedLayerId, selectLayer } = store.getState();
    if (selectedLayerId === id) selectLayer(null);
  }

  function changeImage(id: string, rect: Rect) {
    changeLayers((layers) =>
      layers.map((layer): CanvasLayer =>
        layer.type === CanvasLayerType.IMAGE && layer.id === id ? { ...layer, ...rect } : layer,
      ),
    );
  }

  function changePin(id: string, patch: Point | CanvasPinDetails) {
    changeLayers((layers) =>
      layers.map((layer): CanvasLayer =>
        layer.type === CanvasLayerType.PIN && layer.id === id ? { ...layer, ...patch } : layer,
      ),
    );
  }

  /** Adds a pin while `isAddingPin`, otherwise clears the selection. */
  function clickPoint(point: Point) {
    const { isAddingPin, selectLayer, setIsAddingPin } = store.getState();
    if (!isAddingPin) {
      selectLayer(null);
      return;
    }
    const pinCount = valueRef.current.layers.filter((layer) => layer.type === CanvasLayerType.PIN).length;
    const pin: CanvasPinLayer = {
      type: CanvasLayerType.PIN,
      id: createLayerId(CanvasLayerType.PIN),
      label: `${NEW_PIN_LABEL_PREFIX}${pinCount + 1}`,
      description: "",
      ...point,
    };
    setIsAddingPin(false);
    addLayer(pin);
  }

  function addImage(image: Omit<CanvasImageLayer, "type" | "id">) {
    addLayer({ ...image, type: CanvasLayerType.IMAGE, id: createLayerId(CanvasLayerType.IMAGE) });
  }

  return { addImage, removeLayer, changeImage, changePin, clickPoint };
}
