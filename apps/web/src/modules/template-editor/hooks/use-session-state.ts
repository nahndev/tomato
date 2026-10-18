"use client";

import type { GridLayout, Session, Widget } from "@tomato/types";
import { useMemo } from "react";
import { pickBy } from "remeda";
import { useSessionId } from "../components/session/session-provider";
import { useTemplateState } from "./use-template-state";

export interface SessionState {
  session: Session | undefined;
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
}

export function useSessionState(): SessionState {
  const id = useSessionId();
  const { sessions, widgets, layouts, widgetToSession } = useTemplateState();

  const sessionLayouts = useMemo(
    () => pickBy(layouts, (_, widgetId) => widgetToSession[widgetId] === id),
    [layouts, widgetToSession, id],
  );

  const sessionWidgets = useMemo(
    () => pickBy(widgets, (_, widgetId) => widgetId in sessionLayouts),
    [widgets, sessionLayouts],
  );

  return { session: sessions[id], widgets: sessionWidgets, layouts: sessionLayouts };
}
