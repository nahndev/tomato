import { useLayoutEffect, useRef } from "react";
import type { ImageMapStoreApi } from "../image-map.store";
import { ImageMapLayerType, NEW_PIN_LABEL_PREFIX } from "../image-map.constants";
import type {
  ImageMapImageLayer,
  ImageMapLayer,
  ImageMapPinDetails,
  ImageMapPinLayer,
  ImageMapValue,
  Point,
  Rect,
} from "../image-map.types";
import { createLayerId } from "../utils/layer.utils";
import { useTransformSync } from "./use-transform-sync";

export type ImageMapValueActions = ReturnType<typeof useImageMapValue>;

/** Turns the map's interactions into new values for a controlled `ImageMap`. */
export function useImageMapValue(
  store: ImageMapStoreApi,
  value: ImageMapValue,
  onChangeValue?: (value: ImageMapValue) => void,
) {
  // Changes fired before the next render build on each other.
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  function change(update: (current: ImageMapValue) => ImageMapValue) {
    valueRef.current = update(valueRef.current);
    onChangeValue?.(valueRef.current);
  }

  function changeLayers(update: (layers: readonly ImageMapLayer[]) => ImageMapLayer[]) {
    change((current) => ({ ...current, layers: update(current.layers) }));
  }

  useTransformSync(store, value.viewport.transform, (transform) =>
    change((current) => ({ ...current, viewport: { ...current.viewport, transform } })),
  );

  function addLayer(layer: ImageMapLayer) {
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
      layers.map((layer): ImageMapLayer =>
        layer.type === ImageMapLayerType.IMAGE && layer.id === id ? { ...layer, ...rect } : layer,
      ),
    );
  }

  function changePin(id: string, patch: Point | ImageMapPinDetails) {
    changeLayers((layers) =>
      layers.map((layer): ImageMapLayer =>
        layer.type === ImageMapLayerType.PIN && layer.id === id ? { ...layer, ...patch } : layer,
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
    const pinCount = valueRef.current.layers.filter((layer) => layer.type === ImageMapLayerType.PIN).length;
    const pin: ImageMapPinLayer = {
      type: ImageMapLayerType.PIN,
      id: createLayerId(ImageMapLayerType.PIN),
      label: `${NEW_PIN_LABEL_PREFIX}${pinCount + 1}`,
      description: "",
      ...point,
    };
    setIsAddingPin(false);
    addLayer(pin);
  }

  function addImage(image: Omit<ImageMapImageLayer, "type" | "id">) {
    addLayer({ ...image, type: ImageMapLayerType.IMAGE, id: createLayerId(ImageMapLayerType.IMAGE) });
  }

  return { addImage, removeLayer, changeImage, changePin, clickPoint };
}
