import { useLayoutEffect, useRef } from "react";
import type { CanvasStoreApi } from "../canvas.store";
import {
  CanvasLayerType,
  CanvasTool,
  DEFAULT_TEXT_FONT_SIZE,
  type LayerOrder,
} from "../canvas.constants";
import type {
  CanvasImageLayer,
  CanvasLayer,
  CanvasLayerDetails,
  CanvasTextLayer,
  CanvasValue,
  Point,
  Rect,
  Size,
} from "../canvas.types";
import { createLayerId, duplicateLayer, fitLayersToFrame, isSameSize, moveLayer } from "../utils/layer.utils";
import { useTransformSync } from "./use-transform-sync";

export type ValueActions = ReturnType<typeof useValueActions>;

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

  function reorder(id: string, order: LayerOrder) {
    changeLayers((layers) => moveLayer(layers, id, order));
  }

  function changeImage(id: string, rect: Rect) {
    changeLayer(id, (layer) => (layer.type === CanvasLayerType.IMAGE ? { ...layer, ...rect } : layer));
  }

  function changePin(id: string, point: Point) {
    changeLayer(id, (layer) => (layer.type === CanvasLayerType.PIN ? { ...layer, ...point } : layer));
  }

  function changeZone(id: string, points: readonly Point[]) {
    changeLayer(id, (layer) => (layer.type === CanvasLayerType.ZONE ? { ...layer, points } : layer));
  }

  function changeArrow(id: string, [start, end]: readonly Point[]) {
    if (!start || !end) return;
    changeLayer(id, (layer) => (layer.type === CanvasLayerType.ARROW ? { ...layer, start, end } : layer));
  }

  function changeText(id: string, text: Partial<Pick<CanvasTextLayer, "text" | "fontSize" | "x" | "y">>) {
    changeLayer(id, (layer) => (layer.type === CanvasLayerType.TEXT ? { ...layer, ...text } : layer));
  }

  /** Pins and zones only. */
  function changeDetails(id: string, details: CanvasLayerDetails) {
    changeLayer(id, (layer) =>
      layer.type === CanvasLayerType.PIN || layer.type === CanvasLayerType.ZONE ? { ...layer, ...details } : layer,
    );
  }

  /** All but images; `undefined` resets to the theme color. */
  function changeColor(id: string, color: string | undefined) {
    changeLayer(id, (layer) => (layer.type === CanvasLayerType.IMAGE ? layer : { ...layer, color }));
  }

  function changeIcon(id: string, icon: string) {
    changeLayer(id, (layer) => (layer.type === CanvasLayerType.PIN ? { ...layer, icon } : layer));
  }

  function countLayers(type: CanvasLayerType) {
    return valueRef.current.layers.filter((layer) => layer.type === type).length;
  }

  /** Layers are scaled to fit the new frame. */
  function changeFrame(frame: Size) {
    const current = valueRef.current;
    if (isSameSize(current.frame, frame)) return;
    change(() => ({ ...current, frame, layers: fitLayersToFrame(current.layers, current.frame, frame) }));
  }

  /** The tool's color, left out when it is the theme color. */
  function getNewColor(): { color?: string } {
    const { color } = store.getState();
    return color ? { color } : {};
  }

  function addPin(point: Point) {
    const { pinIcon } = store.getState();
    addLayer({
      type: CanvasLayerType.PIN,
      id: createLayerId(CanvasLayerType.PIN),
      label: `Pin ${countLayers(CanvasLayerType.PIN) + 1}`,
      description: "",
      icon: pinIcon,
      ...point,
      ...getNewColor(),
    });
  }

  /** Starts as an empty draft in editing; it joins the value once it has text. */
  function addText(point: Point) {
    const id = createLayerId(CanvasLayerType.TEXT);
    const { setTextDraft, setEditingLayer } = store.getState();
    setTextDraft({ type: CanvasLayerType.TEXT, id, text: "", fontSize: DEFAULT_TEXT_FONT_SIZE, ...point, ...getNewColor() });
    setEditingLayer(id);
  }

  /** Moves the text between the value and the draft, so the value never holds an empty text. */
  function typeText(id: string, text: string) {
    const { textDraft, setTextDraft } = store.getState();
    const layer = valueRef.current.layers.find((current) => current.id === id);
    const isEmpty = text.trim().length === 0;
    if (layer?.type === CanvasLayerType.TEXT) {
      if (!isEmpty) {
        changeText(id, { text });
        return;
      }
      setTextDraft({ ...layer, text });
      changeLayers((layers) => layers.filter((current) => current.id !== id));
      return;
    }
    if (textDraft?.id !== id) return;
    if (isEmpty) {
      setTextDraft({ ...textDraft, text });
      return;
    }
    setTextDraft(null);
    addLayer({ ...textDraft, text });
  }

  function clickPoint(point: Point) {
    const { tool, selectLayer, setTool } = store.getState();
    if (tool === CanvasTool.ICON || tool === CanvasTool.TEXT) {
      setTool(CanvasTool.SELECT);
      if (tool === CanvasTool.ICON) addPin(point);
      else addText(point);
      return;
    }
    selectLayer(null);
  }

  function addZone(points: readonly Point[]) {
    store.getState().setTool(CanvasTool.SELECT);
    addLayer({
      type: CanvasLayerType.ZONE,
      id: createLayerId(CanvasLayerType.ZONE),
      label: `Zone ${countLayers(CanvasLayerType.ZONE) + 1}`,
      description: "",
      points,
      ...getNewColor(),
    });
  }

  function addArrow(start: Point, end: Point) {
    store.getState().setTool(CanvasTool.SELECT);
    addLayer({ type: CanvasLayerType.ARROW, id: createLayerId(CanvasLayerType.ARROW), start, end, ...getNewColor() });
  }

  function addImage(image: Omit<CanvasImageLayer, "type" | "id">) {
    addLayer({ ...image, type: CanvasLayerType.IMAGE, id: createLayerId(CanvasLayerType.IMAGE) });
  }

  return {
    addImage,
    addZone,
    addArrow,
    removeLayer,
    duplicate,
    setIsLocked,
    reorder,
    changeImage,
    changePin,
    changeZone,
    changeArrow,
    changeText,
    typeText,
    changeDetails,
    changeColor,
    changeIcon,
    changeFrame,
    clickPoint,
  };
}
