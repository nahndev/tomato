"use client";

import { ColorPicker } from "@tomato/color";
import { toHexColor } from "@tomato/utils";
import { useState } from "react";
import { CanvasLayerType } from "../../canvas.constants";
import { useCanvas, useCanvasValue } from "../state-provider";

/** Color of new layers; also recolors the selected layer. Text that is not a color yet stays in the input. */
export function ColorTool() {
  const { value, changeColor } = useCanvasValue();
  const color = useCanvas((state) => state.color);
  const setColor = useCanvas((state) => state.setColor);
  const selectedLayerId = useCanvas((state) => state.selectedLayerId);
  const selected = value.layers.find((layer) => layer.id === selectedLayerId);
  const target =
    selected && selected.type !== CanvasLayerType.IMAGE ? selected : undefined;
  const current = (target ? target.color : color) ?? "";
  // Restarts from the current color when the selection changes.
  const [draft, setDraft] = useState({ for: target?.id, value: current });
  if (draft.for !== target?.id) setDraft({ for: target?.id, value: current });

  function handleChange(next: string) {
    setDraft({ for: target?.id, value: next });
    const hex = toHexColor(next);
    if (!hex) return;
    setColor(hex);
    if (target && hex !== target.color) changeColor(target.id, hex);
  }

  return (
    <span className="flex">
      <ColorPicker
        className="size-7 bg-primary"
        value={draft.value}
        onChange={handleChange}
        aria-invalid={draft.value !== "" && toHexColor(draft.value) === null}
      />
    </span>
  );
}
