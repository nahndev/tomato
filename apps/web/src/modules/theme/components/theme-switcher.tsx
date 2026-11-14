"use client";

import { Theme } from "@tomato/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  cn,
  Typography,
} from "@tomato/ui";
import { PaletteIcon } from "lucide-react";
import { useTheme } from "../hooks/use-theme";
import { THEME_LABELS } from "../theme.constants";

interface ThemeSwitcherProps {
  initialTheme: Theme;
  className?: string;
}

export function ThemeSwitcher({ initialTheme, className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme(initialTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="Change theme"
          aria-label="Change theme"
          className={cn(
            "variant-ghost flex items-center rounded-lg",
            className ?? "size-9 justify-center",
          )}
        >
          <PaletteIcon className="size-5 shrink-0" strokeWidth={1.75} />
          <Typography className="truncate text-sm">Theme</Typography>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {Object.values(Theme).map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {THEME_LABELS[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
