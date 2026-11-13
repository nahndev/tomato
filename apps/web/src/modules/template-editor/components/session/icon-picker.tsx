"use client";

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, cn } from "@tomato/ui";
import { DEFAULT_SESSION_ICON, EditorIcon, EditorIconKey } from "@/modules/template-widget";

interface IconPickerProps {
  value?: string;
  onChange: (icon: EditorIconKey) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon-xs" aria-label="Session icon" className={className}>
          <EditorIcon icon={value ?? DEFAULT_SESSION_ICON} className={cn("size-3.5", !value && "opacity-50")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto p-2">
        <div className="grid grid-cols-5 gap-1">
          {Object.values(EditorIconKey).map((key) => (
            <DropdownMenuItem
              key={key}
              aria-label={key}
              onClick={() => onChange(key)}
              className={cn(
                "flex size-8 items-center justify-center rounded-md p-0 text-muted-foreground",
                value === key && "bg-primary/10 text-primary",
              )}
            >
              <EditorIcon icon={key} className="size-4" />
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
