"use client";

import { Input } from "@tomato/ui";
import { SearchIcon } from "lucide-react";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

interface TemplateFilterProps {
  value: string;
  onChange: (query: string) => void;
}

export function TemplateFilter({ value, onChange }: TemplateFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkeys("ctrl+alt+f", () => inputRef.current?.focus(), {
    preventDefault: true,
  });

  return (
    <div className="relative w-full max-w-xs">
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.75}
      />
      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search..."
        aria-label="Search templates"
        className="border-transparent bg-card pl-10 pr-14 shadow-card"
      />
      <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        ⌘ F
      </kbd>
    </div>
  );
}
