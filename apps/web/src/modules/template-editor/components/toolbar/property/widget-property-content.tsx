"use client";

import type { Widget } from "@tomato/types";
import { PROPERTY_DESCRIPTOR_REGISTRY } from "../../property/descriptors/descriptor-registry";
import { WIDGET_PROPERTY_REGISTRY } from "../../property/property-registry";
import { useWidgetActions } from "../../../sync/hooks/use-widget-actions";

interface WidgetPropertyContentProps {
  widget: Widget;
}

export function WidgetPropertyContent({ widget }: WidgetPropertyContentProps) {
  const { setProperty } = useWidgetActions();
  const keys = WIDGET_PROPERTY_REGISTRY[widget.type];

  if (keys.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">This widget has no configurable properties.</p>;
  }

  return (
    <div key={widget.id} className="flex flex-col gap-4">
      {keys.map((key) => {
        const descriptor = PROPERTY_DESCRIPTOR_REGISTRY[key];
        if (!descriptor) return null;

        const { Component } = descriptor;
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
