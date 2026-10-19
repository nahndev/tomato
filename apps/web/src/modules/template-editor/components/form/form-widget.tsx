"use client";

import type { Widget } from "@tomato/types";
import { Label } from "@tomato/ui";
import { WidgetItems } from "../../constants/widget-items.constants";
import { WidgetComponents } from "../widget/widget-registry";
import { WidgetProvider } from "../widget/widget-provider";

interface FormWidgetProps {
  widget: Widget;
  value: unknown;
  onChange: (widgetId: string, value: unknown) => void;
}

export function FormWidget({ widget, value, onChange }: FormWidgetProps) {
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
        <WidgetComponent widget={widget} value={value} onChange={(next) => onChange(widget.id, next)} />
      </div>
    </WidgetProvider>
  );
}
