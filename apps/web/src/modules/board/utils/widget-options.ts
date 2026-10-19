import type { DisplayType, ValueType } from "@tomato/constants";
import type { TemplateSnapshot, Widget } from "@tomato/types";
import { getValueTypeDisplayTypes, getValueTypes } from "./widget-value-types";

export const UNGROUPED_SESSION = "__ungrouped__";

export interface WidgetOption {
  key: string;
  widget: Widget;
  property: ValueType;
}

export interface WidgetOptionGroup {
  sessionId: string;
  sessionName: string | null;
  options: WidgetOption[];
}

export const formatOptionKey = (widgetId: string, property: ValueType) => `${widgetId}:${property}`;

export function parseOptionKey(key: string): { widgetId: string; property: ValueType } {
  const [widgetId, property] = key.split(":");
  return { widgetId, property: property as ValueType };
}

/**
 * Widgets of a snapshot that can fill a column, one option per value property, grouped by session.
 * `allowedDisplayTypes: null` means unrestricted.
 */
export function groupWidgetOptions(
  snapshot: TemplateSnapshot,
  allowedDisplayTypes: DisplayType[] | null,
): WidgetOptionGroup[] {
  const groups = new Map<string, WidgetOptionGroup>();

  for (const widget of Object.values(snapshot.widgets)) {
    const options = getValueTypes(widget.type)
      .filter(
        (property) =>
          allowedDisplayTypes === null ||
          getValueTypeDisplayTypes(widget.type, property).some((type) => allowedDisplayTypes.includes(type)),
      )
      .map((property) => ({ key: formatOptionKey(widget.id, property), widget, property }));
    if (options.length === 0) continue;

    const sessionId = snapshot.widgetToSession[widget.id] ?? UNGROUPED_SESSION;
    const group = groups.get(sessionId) ?? {
      sessionId,
      sessionName: snapshot.sessions[sessionId]?.name ?? null,
      options: [],
    };
    group.options.push(...options);
    groups.set(sessionId, group);
  }

  return [...groups.values()];
}
