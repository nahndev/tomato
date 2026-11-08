"use client";

import { ConfirmDialog } from "@tomato/ui";
import { CopyIcon, LockIcon, LockOpenIcon, Trash2Icon } from "lucide-react";
import { CanvasLayerType } from "../../canvas.constants";
import type { CanvasLayer } from "../../canvas.types";
import { useCanvasValue } from "../state-provider";
import { ToolbarButton } from "./toolbar-button";

export function LayerTool({ layer }: { layer: CanvasLayer }) {
  const { duplicate, setIsLocked, removeLayer } = useCanvasValue();
  const isLocked = Boolean(layer.isLocked);
  const name = layer.type === CanvasLayerType.IMAGE ? "image" : "pin";

  return (
    <div className="flex items-center gap-1">
      <ToolbarButton label={`Duplicate ${name}`} onClick={() => duplicate(layer.id)}>
        <CopyIcon />
      </ToolbarButton>
      <ToolbarButton
        label={isLocked ? `Unlock ${name}` : `Lock ${name}`}
        aria-pressed={isLocked}
        className="aria-pressed:bg-muted"
        onClick={() => setIsLocked(layer.id, !isLocked)}
      >
        {isLocked ? <LockIcon /> : <LockOpenIcon />}
      </ToolbarButton>
      <ConfirmDialog
        title={`Delete ${name}?`}
        description={`The ${name} is removed from this map.`}
        destructive="Delete"
        onDestructive={() => removeLayer(layer.id)}
      >
        <ToolbarButton label={`Delete ${name}`}>
          <Trash2Icon />
        </ToolbarButton>
      </ConfirmDialog>
    </div>
  );
}
