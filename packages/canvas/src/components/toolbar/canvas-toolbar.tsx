"use client";

import { Separator, cn } from "@tomato/ui";
import { MapPinPlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useCanvas, useCanvasValue } from "../state-provider";
import { FrameMenu } from "./frame-menu";
import { LayerTool } from "./layer-tool";
import { ToolbarButton } from "./toolbar-button";

interface CanvasToolbarProps {
  /** App actions, placed first and followed by a divider; use `ToolbarButton` to match. */
  extension?: ReactNode;
  className?: string;
}

function ToolbarDivider() {
  return <Separator orientation="vertical" className="mx-1 h-5!" />;
}

/** `extension` | layer actions (while a layer is selected) | frame, add pin. */
export function CanvasToolbar({ extension, className }: CanvasToolbarProps) {
  const { value } = useCanvasValue();
  const selectedLayerId = useCanvas((state) => state.selectedLayerId);
  const isAddingPin = useCanvas((state) => state.isAddingPin);
  const setIsAddingPin = useCanvas((state) => state.setIsAddingPin);
  const selectedLayer = value.layers.find((layer) => layer.id === selectedLayerId);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {extension && (
        <>
          <div className="flex items-center gap-1">{extension}</div>
          <ToolbarDivider />
        </>
      )}
      {selectedLayer && (
        <>
          <LayerTool layer={selectedLayer} />
          <ToolbarDivider />
        </>
      )}
      <FrameMenu />
      <ToolbarButton
        label={isAddingPin ? "Click the map to place the pin" : "Add pin"}
        variant={isAddingPin ? "default" : "ghost"}
        aria-pressed={isAddingPin}
        onClick={() => setIsAddingPin(!isAddingPin)}
      >
        <MapPinPlusIcon />
      </ToolbarButton>
    </div>
  );
}
