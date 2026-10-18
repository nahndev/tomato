"use client";

import { WidgetType } from "@tomato/constants";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@tomato/ui";
import { CodeIcon } from "lucide-react";
import { useTemplateState } from "../../../../hooks/use-template-state";

interface TokenInsertMenuProps {
  widgetId: string;
  onInsert: (label: string) => void;
}

export function TokenInsertMenu({ widgetId, onInsert }: TokenInsertMenuProps) {
  const { widgets } = useTemplateState();
  const options = Object.values(widgets).filter(
    (widget) => widget.id !== widgetId && widget.type !== WidgetType.BREAK,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="icon" className="shrink-0" aria-label="Insert component value">
          <CodeIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.length === 0 && <p className="px-2 py-1.5 text-xs text-muted-foreground">No other components yet</p>}
        {options.map((widget) => (
          <DropdownMenuItem key={widget.id} onSelect={() => onInsert(widget.label || widget.id)}>
            {widget.label || "(no label)"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
