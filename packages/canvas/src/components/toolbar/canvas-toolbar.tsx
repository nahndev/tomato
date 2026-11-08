"use client";

import { Separator, cn } from "@tomato/ui";
import { MapPinPlusIcon, PentagonIcon, SquareIcon, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { CanvasTool } from "../../canvas.constants";
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

interface ToolDefinition {
  tool: CanvasTool;
  label: string;
  activeLabel: string;
  icon: LucideIcon;
}

const DRAW_TOOLS: readonly ToolDefinition[] = [
  { tool: CanvasTool.PIN, label: "Add pin", activeLabel: "Click the map to place the pin", icon: MapPinPlusIcon },
  {
    tool: CanvasTool.RECTANGLE,
    label: "Draw rectangle",
    activeLabel: "Drag on the map, hold Shift for a square",
    icon: SquareIcon,
  },
  {
    tool: CanvasTool.POLYGON,
    label: "Draw polygon",
    activeLabel: "Click to add points, Enter or the first point to finish, Esc to cancel",
    icon: PentagonIcon,
  },
];

export function CanvasToolbar({ extension, className }: CanvasToolbarProps) {
  const { value } = useCanvasValue();
  const selectedLayerId = useCanvas((state) => state.selectedLayerId);
  const activeTool = useCanvas((state) => state.tool);
  const setTool = useCanvas((state) => state.setTool);
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
      {DRAW_TOOLS.map(({ tool, label, activeLabel, icon: Icon }) => {
        const isActive = tool === activeTool;
        return (
          <ToolbarButton
            key={tool}
            label={isActive ? activeLabel : label}
            variant={isActive ? "default" : "ghost"}
            aria-pressed={isActive}
            onClick={() => setTool(isActive ? CanvasTool.SELECT : tool)}
          >
            <Icon />
          </ToolbarButton>
        );
      })}
    </div>
  );
}
