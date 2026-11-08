"use client";

import { Separator, cn } from "@tomato/ui";
import {
  CircleIcon,
  HandIcon,
  MousePointer2Icon,
  MoveUpRightIcon,
  PentagonIcon,
  SquareIcon,
  TypeIcon,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { CanvasTool, TOOL_HOTKEYS } from "../../canvas.constants";
import { useCanvas, useCanvasValue } from "../state-provider";
import { ColorTool } from "./color-tool";
import { FrameMenu } from "./frame-menu";
import { IconMenu } from "./icon-menu";
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
  description: string;
  icon: LucideIcon;
}

const NAVIGATE_TOOLS: readonly ToolDefinition[] = [
  { tool: CanvasTool.SELECT, label: "Select", description: "Click a layer to select, move or resize it", icon: MousePointer2Icon },
  { tool: CanvasTool.PAN, label: "Pan", description: "Drag to pan, or hold Space with any tool", icon: HandIcon },
];

const DRAW_TOOLS: readonly ToolDefinition[] = [
  { tool: CanvasTool.TEXT, label: "Text", description: "Click the map to type, Enter to finish", icon: TypeIcon },
  {
    tool: CanvasTool.RECTANGLE,
    label: "Rectangle",
    description: "Drag on the map, hold Shift for a square",
    icon: SquareIcon,
  },
  {
    tool: CanvasTool.ELLIPSE,
    label: "Ellipse",
    description: "Drag on the map, hold Shift for a circle",
    icon: CircleIcon,
  },
  {
    tool: CanvasTool.POLYGON,
    label: "Polygon",
    description: "Click to add points, Enter or the first point to finish, Esc to cancel",
    icon: PentagonIcon,
  },
  {
    tool: CanvasTool.ARROW,
    label: "Arrow",
    description: "Drag from the tail to the head, hold Shift to snap to 45°",
    icon: MoveUpRightIcon,
  },
];

function ToolButtons({ tools }: { tools: readonly ToolDefinition[] }) {
  const activeTool = useCanvas((state) => state.tool);
  const setTool = useCanvas((state) => state.setTool);

  return tools.map(({ tool, label, description, icon: Icon }) => {
    const isActive = tool === activeTool;
    return (
      <ToolbarButton
        key={tool}
        label={label}
        description={description}
        hotkey={TOOL_HOTKEYS[tool]}
        variant={isActive ? "default" : "ghost"}
        aria-pressed={isActive}
        onClick={() => setTool(isActive ? CanvasTool.SELECT : tool)}
      >
        <Icon />
      </ToolbarButton>
    );
  });
}

export function CanvasToolbar({ extension, className }: CanvasToolbarProps) {
  const { value } = useCanvasValue();
  const selectedLayerId = useCanvas((state) => state.selectedLayerId);
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
      <ToolButtons tools={NAVIGATE_TOOLS} />
      <ToolbarDivider />
      <IconMenu />
      <ToolButtons tools={DRAW_TOOLS} />
      <ColorTool />
      <ToolbarDivider />
      <FrameMenu />
    </div>
  );
}
