"use client";

import type { Widget } from "@/shared/types/template.types";
import { Label } from "@tomato/ui";
import type { PropsWithChildren } from "react";
import { WidgetItems } from "../constants/widget-items.constants";
import type { FieldComponentProps } from "../template-widget.types";
import { WidgetProvider } from "./widget-provider";
import { WidgetComponents } from "./widget-registry";

export function WidgetComponent(props: FieldComponentProps) {
  const Component = WidgetComponents[props.widget.type];
  return <Component {...props} />;
}

interface WidgetViewProps {
  widget: Widget;
}

export function WidgetView({ widget, children }: PropsWithChildren<WidgetViewProps>) {
  return (
    <WidgetProvider widgetId={widget.id}>
      <div className="flex flex-col gap-1.5 p-2">
        {WidgetItems[widget.type].isDataField && (
          <Label htmlFor={widget.id}>
            {widget.label || "(no label)"}
            {widget.required ? " *" : ""}
          </Label>
        )}
        {children}
      </div>
    </WidgetProvider>
  );
}
