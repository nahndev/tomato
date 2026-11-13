"use client";

import { Separator } from "@tomato/ui";
import { WidgetItems } from "@/modules/template-widget";
import { useSelectedWidget } from "../../provider/widget-selection-provider";
import { WidgetPropertyContent } from "./widget-property-content";

export function PropertyToolbar() {
  const selected = useSelectedWidget();

  if (!selected) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Select a widget to edit its properties.</p>;
  }

  return (
    <div className="flex flex-col gap-4 p-3">
      <div>
        <p className="truncate text-sm font-medium">{selected.label || "(no label)"}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Type: <span className="font-medium text-foreground">{WidgetItems[selected.type].label}</span>
        </p>
      </div>
      <Separator />
      <WidgetPropertyContent widget={selected} />
    </div>
  );
}
