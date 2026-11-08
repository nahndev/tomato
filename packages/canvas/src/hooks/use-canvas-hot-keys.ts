import { useHotkeys } from "react-hotkeys-hook";
import { CanvasTool, DUPLICATE_HOTKEY, LAYER_ORDER_HOTKEYS, LayerOrder, TOOL_HOTKEYS } from "../canvas.constants";
import { useCanvasStore, useCanvasValue } from "../components/state-provider";
import { isShapeDrawTool } from "./use-shape-draw";

export function useCanvasHotkeys() {
  const store = useCanvasStore();
  const { value, removeLayer, duplicate, reorder } = useCanvasValue();

  function getSelectedLayer() {
    const { tool, selectedLayerId } = store.getState();
    if (tool !== CanvasTool.SELECT) return undefined;
    return value.layers.find((layer) => layer.id === selectedLayerId);
  }

  useHotkeys(
    ["delete", "backspace"],
    () => {
      const layer = getSelectedLayer();
      if (layer && !layer.isLocked) removeLayer(layer.id);
    },
    [value.layers, removeLayer],
  );

  useHotkeys(
    DUPLICATE_HOTKEY,
    () => {
      const layer = getSelectedLayer();
      if (layer) duplicate(layer.id);
    },
    { preventDefault: true },
    [value.layers, duplicate],
  );

  useHotkeys(
    Object.values(LAYER_ORDER_HOTKEYS),
    (_, { hotkey }) => {
      const layer = getSelectedLayer();
      const order = Object.values(LayerOrder).find((current) => LAYER_ORDER_HOTKEYS[current] === hotkey);
      if (layer && order) reorder(layer.id, order);
    },
    [value.layers, reorder],
  );

  useHotkeys(Object.values(TOOL_HOTKEYS), (_, { hotkey }) => {
    const tool = Object.values(CanvasTool).find((current) => TOOL_HOTKEYS[current] === hotkey);
    if (tool) store.getState().setTool(tool);
  });

  // Shape tools handle Esc themselves, so a shape being drawn is cleared first.
  useHotkeys("esc", () => {
    const { tool, setTool, selectLayer } = store.getState();
    if (tool === CanvasTool.SELECT) selectLayer(null);
    else if (!isShapeDrawTool(tool)) setTool(CanvasTool.SELECT);
  });
}
