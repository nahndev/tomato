"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@tomato/ui";
import { FrameIcon } from "lucide-react";
import { FRAME_PRESETS } from "../../canvas.constants";
import type { Size } from "../../canvas.types";
import { isSameSize } from "../../utils/layer.utils";
import { useCanvasValue } from "../state-provider";
import { ToolbarButton } from "./toolbar-button";

/** Side of the largest preview, in pixels. */
const PREVIEW_SIZE = 20;

function FramePreview({ width, height }: Size) {
  const scale = PREVIEW_SIZE / Math.max(width, height);
  return (
    <span className="flex size-5 shrink-0 items-center justify-center" aria-hidden>
      <span className="rounded-xs border-2 border-current" style={{ width: width * scale, height: height * scale }} />
    </span>
  );
}

export function FrameMenu() {
  const { value, changeFrame } = useCanvasValue();
  const current = FRAME_PRESETS.findIndex((preset) => isSameSize(preset.size, value.frame));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton label="Frame">
          <FrameIcon />
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          Frame · {value.frame.width} × {value.frame.height}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={String(current)}
          onValueChange={(index) => changeFrame(FRAME_PRESETS[Number(index)]!.size)}
        >
          {FRAME_PRESETS.map(({ name, size }, index) => (
            <DropdownMenuRadioItem key={name} value={String(index)} className="gap-2">
              <FramePreview {...size} />
              <span className="flex-1">{name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {size.width}×{size.height}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
