import type { WidgetType } from "@tomato/constants";
import type { Widget } from "@tomato/types";
import { CONTAINER_WIDGET_TYPES } from "../template-widget.constants";

interface WidgetTree {
  widgets: Record<string, Widget>;
  widgetToSession: Record<string, string>;
}

export function isContainerWidget(type: WidgetType | undefined): boolean {
  return type !== undefined && CONTAINER_WIDGET_TYPES.includes(type);
}

/** The container widget whose content is this session. */
export function findContainerWidgetId(widgets: Record<string, Widget>, sessionId: string): string | undefined {
  return Object.values(widgets).find((widget) => widget.session?.id === sessionId)?.id;
}

/** For a container's content session, the session the container sits in. */
export function getTopSessionId({ widgets, widgetToSession }: WidgetTree, sessionId: string): string | undefined {
  const containerId = findContainerWidgetId(widgets, sessionId);
  return containerId ? widgetToSession[containerId] : sessionId;
}
