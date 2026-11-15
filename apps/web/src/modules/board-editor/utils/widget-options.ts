import type { DisplayType, ValueType } from "@tomato/constants";
import type { TemplateSnapshot, Widget } from "@/shared/types/template.types";
import { getValueTypeDisplayTypes, getValueTypes } from "./widget-value-types";

export const UNGROUPED_SESSION = "__ungrouped__";

export interface WidgetOption {
  key: string;
  widget: Widget;
  property: ValueType;
}

export interface SessionGroup<T> {
  sessionId: string;
  sessionName: string | null;
  options: T[];
}

export type WidgetOptionGroup = SessionGroup<WidgetOption>;

export const formatOptionKey = (widgetId: string, property: ValueType) => `${widgetId}:${property}`;

export function parseOptionKey(key: string): { widgetId: string; property: ValueType } {
  const [widgetId, property] = key.split(":");
  return { widgetId, property: property as ValueType };
}

export function groupBySession<T>(
  snapshot: TemplateSnapshot,
  toOptions: (widget: Widget) => T[],
): SessionGroup<T>[] {
  const groups = new Map<string, SessionGroup<T>>();

  for (const widget of Object.values(snapshot.widgets)) {
    const options = toOptions(widget);
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

/** `allowedDisplayTypes: null` means unrestricted. */
export function groupWidgetOptions(
  snapshot: TemplateSnapshot,
  allowedDisplayTypes: DisplayType[] | null,
): WidgetOptionGroup[] {
  return groupBySession(snapshot, (widget) =>
    getValueTypes(widget.type)
      .filter(
        (property) =>
          allowedDisplayTypes === null ||
          getValueTypeDisplayTypes(widget.type, property).some((type) => allowedDisplayTypes.includes(type)),
      )
      .map((property) => ({ key: formatOptionKey(widget.id, property), widget, property })),
  );
}
