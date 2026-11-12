"use client";

import type { Widget } from "@/shared/types/template.types";
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tomato/ui";
import { findContainerWidgetId } from "@/modules/template-widget";
import { useTemplateState } from "../../../hooks/use-template-state";
import type { WidgetPropertyFieldProps } from "../../../template-editor.types";
import { LINK_WIDGET_CHOICES } from "../property.constants";

function isInsideContainer(
  widgets: Record<string, Widget>,
  widgetToSession: Record<string, string>,
  widgetId: string,
  containerId: string,
): boolean {
  let sessionId = widgetToSession[widgetId];
  while (sessionId) {
    const parentId = findContainerWidgetId(widgets, sessionId);
    if (!parentId) return false;
    if (parentId === containerId) return true;
    sessionId = widgetToSession[parentId];
  }
  return false;
}

export function LinkWidgetDescriptor({
  widgetId,
  widgetType,
  value,
  onChange,
}: WidgetPropertyFieldProps<"linkWidgetUuid">) {
  const { widgets, widgetToSession } = useTemplateState();
  const choice = LINK_WIDGET_CHOICES[widgetType];
  const candidates = Object.values(widgets).filter(
    (widget) =>
      choice?.types.includes(widget.type) && !isInsideContainer(widgets, widgetToSession, widget.id, widgetId),
  );

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-link-widget">Linked widget</Label>
      <Select
        value={value && widgets[value] ? value : ""}
        onValueChange={(next) => onChange(next)}
      >
        <SelectTrigger id="prop-link-widget" className="w-full">
          <SelectValue placeholder="Select a widget" />
        </SelectTrigger>
        <SelectContent>
          {candidates.map((widget) => (
            <SelectItem key={widget.id} value={widget.id}>
              {widget.label || "(no label)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-xs text-muted-foreground">{choice?.hint}</span>
    </div>
  );
}
