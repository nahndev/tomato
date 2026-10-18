"use client";

import { WidgetType } from "@tomato/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tomato/ui";
import { useTemplateState } from "../../../../hooks/use-template-state";

interface ComponentSelectProps {
  excludeWidgetId: string;
  value: string | undefined;
  onChange: (widgetId: string) => void;
  placeholder?: string;
}

/** Picks a sibling widget to read from or fill; `label` stays selectable as a display-only target. */
export function ComponentSelect({
  excludeWidgetId,
  value,
  onChange,
  placeholder = "Choose a component…",
}: ComponentSelectProps) {
  const { widgets } = useTemplateState();
  const options = Object.values(widgets).filter(
    (widget) => widget.id !== excludeWidgetId && widget.type !== WidgetType.BREAK,
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-full min-w-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 && <p className="px-2 py-1.5 text-xs text-muted-foreground">No other components yet</p>}
        {options.map((widget) => (
          <SelectItem key={widget.id} value={widget.id}>
            {widget.label || "(no label)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
