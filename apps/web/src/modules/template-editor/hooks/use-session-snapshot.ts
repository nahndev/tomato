"use client";

import type { GridLayout, Session, Widget } from "@/shared/types/template.types";
import { useMemo } from "react";
import { pickBy } from "remeda";
import { useSessionId } from "../components/provider/session-id-provider";
import { useTemplateSnapshot } from "../components/provider/template-snapshot-provider";
import { useShallow } from "@tomato/store-context";

export interface SessionSnapshot {
  session: Session | undefined;
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
}

export function useSessionSnapshot(): SessionSnapshot {
  const id = useSessionId();
  const { sessions, widgets, layouts, widgetToSession } = useTemplateSnapshot(
    useShallow(({ sessions, widgets, layouts, widgetToSession }) => ({
      sessions, widgets, layouts, widgetToSession,
    })),
  );

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
