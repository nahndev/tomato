"use client";

import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@tomato/ui";
import type { ComponentProps } from "react";

interface ToolbarButtonProps extends Omit<ComponentProps<typeof Button>, "size" | "aria-label"> {
  /** Accessible name and tooltip. */
  label: string;
}

/** Icon button with a tooltip; can be the `asChild` trigger of a dialog or menu. */
export function ToolbarButton({ label, variant = "ghost", ...props }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={variant} size="icon-sm" aria-label={label} {...props} />
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
