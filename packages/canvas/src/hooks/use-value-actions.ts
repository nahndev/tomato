import { useLayoutEffect, useRef } from "react";
import type { CanvasStoreApi } from "../canvas.store";
import { CanvasLayerType, NEW_PIN_LABEL_PREFIX } from "../canvas.constants";
import type {
  CanvasImageLayer,
  CanvasLayer,
  CanvasPinDetails,
  CanvasValue,
  Point,
  Rect,
  Size,
} from "../canvas.types";
import { createLayerId, duplicateLayer, fitLayersToFrame, isSameSize } from "../utils/layer.utils";
import { useTransformSync } from "./use-transform-sync";

export type ValueActions = ReturnType<typeof useValueActions>;

/** Turns the canvas interactions into new values for a controlled `Canvas`. */
export function useValueActions(
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

  function changeLayer(id: string, update: (layer: CanvasLayer) => CanvasLayer) {
    changeLayers((layers) => layers.map((layer) => (layer.id === id ? update(layer) : layer)));
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

  function duplicate(id: string) {
    const layer = valueRef.current.layers.find((current) => current.id === id);
    if (layer) addLayer(duplicateLayer(layer));
  }

  function setIsLocked(id: string, isLocked: boolean) {
    changeLayer(id, (layer) => ({ ...layer, isLocked }));
  }

  function changeImage(id: string, rect: Rect) {
    changeLayer(id, (layer) => (layer.type === CanvasLayerType.IMAGE ? { ...layer, ...rect } : layer));
  }

  function changePin(id: string, patch: Point | CanvasPinDetails) {
    changeLayer(id, (layer) => (layer.type === CanvasLayerType.PIN ? { ...layer, ...patch } : layer));
  }

  /** Layers are scaled to fit the new frame. */
  function changeFrame(frame: Size) {
    const current = valueRef.current;
    if (isSameSize(current.frame, frame)) return;
    change(() => ({ ...current, frame, layers: fitLayersToFrame(current.layers, current.frame, frame) }));
  }

  /** Adds a pin while `isAddingPin`, otherwise clears the selection. */
  function clickPoint(point: Point) {
    const { isAddingPin, selectLayer, setIsAddingPin } = store.getState();
    if (!isAddingPin) {
      selectLayer(null);
      return;
    }
    const pinCount = valueRef.current.layers.filter((layer) => layer.type === CanvasLayerType.PIN).length;
    setIsAddingPin(false);
    addLayer({
      type: CanvasLayerType.PIN,
      id: createLayerId(CanvasLayerType.PIN),
      label: `${NEW_PIN_LABEL_PREFIX}${pinCount + 1}`,
      description: "",
      ...point,
    });
  }

  function addImage(image: Omit<CanvasImageLayer, "type" | "id">) {
    addLayer({ ...image, type: CanvasLayerType.IMAGE, id: createLayerId(CanvasLayerType.IMAGE) });
  }

  return { addImage, removeLayer, duplicate, setIsLocked, changeImage, changePin, changeFrame, clickPoint };
}
