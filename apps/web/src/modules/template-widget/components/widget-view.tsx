"use client";

import type { Widget } from "@tomato/types";
import { Label } from "@tomato/ui";
import { WidgetItems } from "../constants/widget-items.constants";
import { WidgetProvider } from "./widget-provider";
import { WidgetComponents } from "./widget-registry";

interface WidgetViewProps {
  widget: Widget;
  value?: unknown;
  onChange?: (value: unknown) => void;
}

export function WidgetView({ widget, value, onChange }: WidgetViewProps) {
  const WidgetComponent = WidgetComponents[widget.type];

  return (
    <WidgetProvider widgetId={widget.id}>
      <div className="flex flex-col gap-1.5 p-2">
        {WidgetItems[widget.type].isDataField && (
          <Label htmlFor={widget.id}>
            {widget.label || "(no label)"}
            {widget.required ? " *" : ""}
          </Label>
        )}
        <WidgetComponent widget={widget} value={value} onChange={onChange} />
      </div>
    </WidgetProvider>
  );
}
