"use client";

import type { Widget } from "@/shared/types/template.types";
import { PROPERTY_FIELD_REGISTRY } from "./property-field-registry";
import { WIDGET_PROPERTY_KEYS } from "../../../template-editor.constants";
import { useWidgetActions } from "../../../sync/hooks/use-widget-actions";

interface WidgetPropertyContentProps {
  widget: Widget;
}

export function WidgetPropertyContent({ widget }: WidgetPropertyContentProps) {
  const { setProperty } = useWidgetActions();
  const keys = WIDGET_PROPERTY_KEYS[widget.type];

  if (keys.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">This widget has no configurable properties.</p>;
  }

  return (
    <div key={widget.id} className="flex flex-col gap-4">
      {keys.map((key) => {
        const field = PROPERTY_FIELD_REGISTRY[key];
        if (!field) return null;

        const { Component } = field;
        return (
          <Component
            key={key}
            widgetId={widget.id}
            widgetType={widget.type}
            value={widget[key]}
            onChange={(value) => setProperty(widget.id, key, value)}
          />
        );
      })}
    </div>
  );
}
