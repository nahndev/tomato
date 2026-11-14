"use client";

import { ImageIcon, LockIcon, MoveUpRightIcon, PentagonIcon, TypeIcon } from "lucide-react";
import { CanvasLayerType } from "../../canvas.constants";
import type { CanvasLayer } from "../../canvas.types";
import { toLayerList } from "../../utils/layer.utils";
import { getPinIcon } from "../../utils/pin-icon.utils";
import { useCanvas, useCanvasValue } from "../state-provider";

import { Typography } from "@tomato/ui";
const LAYER_ICONS = {
  [CanvasLayerType.IMAGE]: ImageIcon,
  [CanvasLayerType.ZONE]: PentagonIcon,
  [CanvasLayerType.TEXT]: TypeIcon,
  [CanvasLayerType.ARROW]: MoveUpRightIcon,
} as const;

function getLayerIcon(layer: CanvasLayer) {
  return layer.type === CanvasLayerType.PIN ? getPinIcon(layer.icon).icon : LAYER_ICONS[layer.type];
}

export function LayersPanel() {
  const { value } = useCanvasValue();
  const selectedLayerId = useCanvas((state) => state.selectedLayerId);
  const selectLayer = useCanvas((state) => state.selectLayer);
  const items = toLayerList(value.layers);

  if (items.length === 0) {
    return <Typography as="p" className="text-sm text-muted-foreground">No layers yet. Add an image, an icon, a text or a shape from the toolbar.</Typography>;
  }

  return (
    <ul className="grid gap-1">
      {items.map(({ layer, label }) => {
        const isSelected = layer.id === selectedLayerId;
        const Icon = getLayerIcon(layer);
        return (
          <li key={layer.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => selectLayer(isSelected ? null : layer.id)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted focus-ring aria-pressed:bg-muted aria-pressed:font-medium"
            >
              <Icon className="size-4 shrink-0 text-primary" strokeWidth={1.75} />
              <Typography className="flex-1 truncate">{label}</Typography>
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
