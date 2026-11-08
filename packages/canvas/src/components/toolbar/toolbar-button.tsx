"use client";

import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@tomato/ui";
import type { ComponentProps } from "react";

interface ToolbarButtonProps extends Omit<ComponentProps<typeof Button>, "size" | "aria-label"> {
  /** Accessible name and tooltip. */
  label: string;
  tooltipSide?: ComponentProps<typeof TooltipContent>["side"];
}

export function ToolbarButton({ label, tooltipSide = "bottom", variant = "ghost", ...props }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={variant} size="icon-sm" aria-label={label} {...props} />
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{label}</TooltipContent>
    </Tooltip>
  );
}
