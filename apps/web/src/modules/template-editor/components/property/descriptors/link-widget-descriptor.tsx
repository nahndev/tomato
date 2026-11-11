"use client";

import { LinkTargetType } from "@tomato/constants";
import type { Widget } from "@/shared/types/template.types";
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tomato/ui";
import { findContainerWidgetId, isRepeatLinkWidget } from "@/modules/template-widget";
import { NO_LINK_WIDGET_VALUE } from "../../../template-editor.constants";
import { useTemplateState } from "../../../hooks/use-template-state";
import { useLinkActions } from "../../../sync/hooks/use-link-actions";

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

export function LinkWidgetDescriptor({ widgetId }: { widgetId: string }) {
  const { widgets, widgetToSession, links } = useTemplateState();
  const { setWidgetLink } = useLinkActions();
  const value = links[widgetId]?.[LinkTargetType.WIDGET]?.uuid;
  const candidates = Object.values(widgets).filter(
    (widget) => isRepeatLinkWidget(widget) && !isInsideContainer(widgets, widgetToSession, widget.id, widgetId),
  );

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-link-widget">Linked widget</Label>
      <Select
        value={value && widgets[value] ? value : NO_LINK_WIDGET_VALUE}
        onValueChange={(next) => setWidgetLink(widgetId, next === NO_LINK_WIDGET_VALUE ? undefined : next)}
      >
        <SelectTrigger id="prop-link-widget" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_LINK_WIDGET_VALUE}>None</SelectItem>
          {candidates.map((widget) => (
            <SelectItem key={widget.id} value={widget.id}>
              {widget.label || "(no label)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-xs text-muted-foreground">One tab per option (or user) of this widget.</span>
    </div>
  );
}
