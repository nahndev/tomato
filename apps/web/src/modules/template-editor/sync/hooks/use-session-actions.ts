"use client";

import type { GridLayout, SessionProperties } from "@/shared/types/template.types";
import { useHandler, useTransaction } from "@/shared/lib/sync";
import { LayoutHandler, type WidgetPlacement } from "../handlers/layout-handler";
import { SessionHandler } from "../handlers/session-handler";
import { WidgetHandler } from "../handlers/widget-handler";

export interface SessionActions {
  addSession: (id: string, properties: SessionProperties) => void;
  updateSession: (sessionId: string, patch: Partial<SessionProperties>) => void;
  removeSession: (sessionId: string) => void;
  updateLayout: (widgetId: string, sessionId: string, layout: Partial<GridLayout>) => void;
  placeWidget: (widgetId: string, placement: WidgetPlacement) => void;
}

export function useSessionActions(): SessionActions {
  const sessionHandler = useHandler(SessionHandler);
  const layoutHandler = useHandler(LayoutHandler);
  const widgetHandler = useHandler(WidgetHandler);
  const transact = useTransaction();

  return {
    addSession: (id, properties) => transact(() => sessionHandler.addSession(id, properties)),
    updateSession: (sessionId, patch) => transact(() => sessionHandler.updateSession(sessionId, patch)),
    removeSession: (sessionId) => transact(() => sessionHandler.removeSession(sessionId)),
    updateLayout: (widgetId, sessionId, patch) => {
      if (widgetHandler.canPlace(widgetId, sessionId)) transact(() => layoutHandler.setLayout(widgetId, sessionId, patch));
    },
    placeWidget: (widgetId, placement) => {
      const sessionId = placement.sessionId ?? layoutHandler.getSessionId(widgetId);
      if (!sessionId || widgetHandler.canPlace(widgetId, sessionId)) {
        transact(() => layoutHandler.placeWidget(widgetId, placement));
      }
    },
  };
}
