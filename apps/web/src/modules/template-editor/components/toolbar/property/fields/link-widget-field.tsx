"use client";

import type { Widget } from "@/shared/types/template.types";
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Typography } from "@tomato/ui";
import { useTemplateSnapshot } from "../../../provider/template-snapshot-provider";
import type { PropertyFieldProps } from "../../../../template-editor.types";
import { LINK_WIDGET_CHOICES } from "../../../../template-editor.constants";
import { findContainerWidgetId } from "../../../../utils/container-widget";
import { useShallow } from "@tomato/store-context";

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

export function LinkWidgetField({
  widgetId,
  widgetType,
  value,
  onChange,
}: PropertyFieldProps<"linkWidgetUuid">) {
  const { widgets, widgetToSession } = useTemplateSnapshot(
    useShallow(({ widgets, widgetToSession }) => ({ widgets, widgetToSession })),
  );
  const choice = LINK_WIDGET_CHOICES[widgetType];
  const candidates = Object.values(widgets).filter(
    (widget) =>
      choice?.types.includes(widget.type) && !isInsideContainer(widgets, widgetToSession, widget.id, widgetId),
  );

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-link-widget"><Typography>Linked widget</Typography></Label>
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
      <Typography className="text-xs text-muted-foreground">{choice?.hint}</Typography>
    </div>
  );
}
