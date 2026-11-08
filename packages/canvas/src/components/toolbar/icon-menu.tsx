"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@tomato/ui";
import { CanvasTool, TOOL_HOTKEYS } from "../../canvas.constants";
import { getPinIcon } from "../../utils/pin-icon.utils";
import { PinIconGrid } from "../pin-icon-grid";
import { useCanvas } from "../state-provider";
import { ToolbarButton } from "./toolbar-button";

/** Picking an icon turns the icon tool on. */
export function IconMenu() {
  const isActive = useCanvas((state) => state.tool === CanvasTool.ICON);
  const pinIcon = useCanvas((state) => state.pinIcon);
  const setPinIcon = useCanvas((state) => state.setPinIcon);
  const setTool = useCanvas((state) => state.setTool);
  const { icon: Icon } = getPinIcon(pinIcon);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          label="Icon"
          description="Pick an icon, then click the map to place it"
          hotkey={TOOL_HOTKEYS[CanvasTool.ICON]}
          variant={isActive ? "default" : "ghost"}
          aria-pressed={isActive}
        >
          <Icon />
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-48">
        <DropdownMenuLabel>Icon</DropdownMenuLabel>
        <PinIconGrid
          value={pinIcon}
          onSelect={(icon) => {
            setPinIcon(icon);
            setTool(CanvasTool.ICON);
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
