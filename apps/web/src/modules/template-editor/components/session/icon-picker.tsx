"use client";

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, cn } from "@tomato/ui";
import { EditorIconKey } from "../../template-editor.icons";
import { EditorIcon } from "../editor-icon";

interface IconPickerProps {
  value?: string;
  onChange: (icon: EditorIconKey) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="icon" aria-label="Session icon" className={className}>
          <EditorIcon icon={value ?? EditorIconKey.CLOCK} className={cn(!value && "text-muted-foreground")} />
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
