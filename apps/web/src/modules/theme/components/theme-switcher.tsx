"use client";

import { Theme } from "@tomato/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@tomato/ui";
import { PaletteIcon } from "lucide-react";
import { useTheme } from "../hooks/use-theme";
import { THEME_LABELS } from "../theme.constants";

export function ThemeSwitcher({ initialTheme }: { initialTheme: Theme }) {
  const { theme, setTheme } = useTheme(initialTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="Change theme"
          aria-label="Change theme"
          className="variant-ghost flex size-9 items-center justify-center rounded-lg"
        >
          <PaletteIcon className="size-5" strokeWidth={1.75} />
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
