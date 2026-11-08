"use client";

import { ImageIcon, LockIcon, MapPinIcon } from "lucide-react";
import { CanvasLayerType } from "../../canvas.constants";
import { toLayerList } from "../../utils/layer.utils";
import { useCanvas, useCanvasValue } from "../state-provider";

export function LayersPanel() {
  const { value } = useCanvasValue();
  const selectedLayerId = useCanvas((state) => state.selectedLayerId);
  const selectLayer = useCanvas((state) => state.selectLayer);
  const items = toLayerList(value.layers);

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No layers yet. Add an image or a pin from the toolbar.</p>;
  }

  return (
    <ul className="grid gap-1">
      {items.map(({ layer, label }) => {
        const isSelected = layer.id === selectedLayerId;
        const Icon = layer.type === CanvasLayerType.PIN ? MapPinIcon : ImageIcon;
        return (
          <li key={layer.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => selectLayer(isSelected ? null : layer.id)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted focus-ring aria-pressed:bg-muted aria-pressed:font-medium"
            >
              <Icon className="size-4 shrink-0 text-primary" strokeWidth={1.75} />
              <span className="flex-1 truncate">{label}</span>
              {layer.isLocked && (
                <LockIcon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-label="Locked" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
