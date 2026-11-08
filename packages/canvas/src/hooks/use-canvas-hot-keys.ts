import { useHotkeys } from "react-hotkeys-hook";
import { CanvasTool } from "../canvas.constants";
import { useCanvasStore, useCanvasValue } from "../components/state-provider";

export function useCanvasHotkeys() {
  const store = useCanvasStore();
  const { value, removeLayer } = useCanvasValue();

  useHotkeys(
    ["delete", "backspace"],
    () => {
      const { tool, selectedLayerId } = store.getState();
      if (tool !== CanvasTool.SELECT) return;
      const layer = value.layers.find((current) => current.id === selectedLayerId);
      if (layer && !layer.isLocked) removeLayer(layer.id);
    },
    [value.layers, removeLayer],
  );
}
