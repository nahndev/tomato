"use client";

import { Button } from "@tomato/ui";
import type { ComponentProps } from "react";
import { formatHotkey } from "../../utils/hotkey.utils";

interface ToolbarButtonProps extends Omit<
  ComponentProps<typeof Button>,
  "size" | "aria-label"
> {
  label: string;
  description?: string;
  hotkey?: string;
}

export function ToolbarButton({
  label,
  description,
  hotkey,
  variant = "ghost",
  ...props
}: ToolbarButtonProps) {
  const shortcut = hotkey && formatHotkey(hotkey);
  return (
    <Button
      variant={variant}
      size="icon-sm"
      aria-label={label}
      aria-description={description}
      aria-keyshortcuts={shortcut || undefined}
      {...props}
    />
  );
}
