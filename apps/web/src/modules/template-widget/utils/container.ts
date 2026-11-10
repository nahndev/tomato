import { SessionNestedType, type WidgetType } from "@tomato/constants";
import type { Session, Widget } from "@tomato/types";
import { generateId } from "@tomato/utils";
import { CONTAINER_WIDGET_TYPES } from "../template-widget.constants";

interface WidgetTree {
  widgets: Record<string, Widget>;
  widgetToSession: Record<string, string>;
}

export function isContainerWidget(type: WidgetType | undefined): boolean {
  return type !== undefined && CONTAINER_WIDGET_TYPES.includes(type);
}

/** A new session holding part of a container widget's content. */
export function createContentSession(containerId: string, name: string): Session {
  return { id: generateId(), name, nested: { type: SessionNestedType.WIDGET, uuid: containerId } };
}

/** Sessions holding a container widget's content: a canvas's session or a mixed view's tabs. */
export function getContentSessions(widget: Widget): Session[] {
  if (widget.session) return [widget.session];
  return widget.tabs ?? [];
}

/** The container widget whose content is this session. */
export function findContainerWidgetId(widgets: Record<string, Widget>, sessionId: string): string | undefined {
  return Object.values(widgets).find((widget) => getContentSessions(widget).some(({ id }) => id === sessionId))?.id;
}

/** For a container's content session, the session the container sits in. */
export function getTopSessionId({ widgets, widgetToSession }: WidgetTree, sessionId: string): string | undefined {
  const containerId = findContainerWidgetId(widgets, sessionId);
  return containerId ? widgetToSession[containerId] : sessionId;
}
