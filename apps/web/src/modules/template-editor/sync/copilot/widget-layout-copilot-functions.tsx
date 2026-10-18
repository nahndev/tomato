"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { DEFAULT_LAYOUT } from "../../constants/widget-layouts.constants";
import { useTemplateState } from "../../hooks/use-template-state";
import type { WidgetPosition } from "../handlers/layout-handler";
import { useSessionActions } from "../hooks/use-session-actions";
import { findLayoutError, toPlacementLayout, widgetLayoutInput } from "./copilot-widget-layout";

const setWidgetLayoutParameters = widgetLayoutInput.extend({
  widgetId: z.string().describe("Id of the widget to move or resize."),
  afterWidgetId: z
    .string()
    .optional()
    .describe(
      "Place the widget right after this widget in the order. Widgets further down the order sit lower, so put a widget right after the one it should share a row with.",
    ),
  moveTo: z
    .enum(["first", "last"])
    .optional()
    .describe("Place the widget first or last in its session. Not together with `afterWidgetId`."),
  sessionId: z
    .string()
    .optional()
    .describe("Move the widget to this session. Without `afterWidgetId` / `moveTo` it goes to the end of that session."),
});

type SetWidgetLayoutInput = z.infer<typeof setWidgetLayoutParameters>;

/** Registers the tool that moves and resizes an existing widget; nothing is written on failure. Renders nothing. */
export function WidgetLayoutCopilotFunctions() {
  const { widgets, sessions, layouts, widgetToSession } = useTemplateState();
  const { placeWidget } = useSessionActions();

  useFrontendTool(
    {
      name: "setWidgetLayout",
      description:
        "Move or resize a widget on the grid: change its column, span or full width, its place in the order (so which widgets share a row) and the session it is in. Only the fields given change.",
      parameters: setWidgetLayoutParameters,
      handler: async (input: SetWidgetLayoutInput) => {
        const { widgetId, afterWidgetId, moveTo, sessionId } = input;
        if (!widgets[widgetId]) return `Error: no widget with id "${widgetId}".`;
        if (afterWidgetId && moveTo) return "Error: give either `afterWidgetId` or `moveTo`, not both.";
        if (sessionId && !sessions[sessionId]) return `Error: no session with id "${sessionId}".`;

        const layoutError = findLayoutError(input, layouts[widgetId] ?? DEFAULT_LAYOUT);
        if (layoutError) return layoutError;

        const currentSessionId = widgetToSession[widgetId];
        const targetSessionId = sessionId ?? currentSessionId;
        if (afterWidgetId) {
          if (afterWidgetId === widgetId) return "Error: a widget cannot be placed after itself.";
          if (widgetToSession[afterWidgetId] !== targetSessionId) {
            return `Error: widget "${afterWidgetId}" is not in the session the widget goes to.`;
          }
        }

        const movesSession = targetSessionId !== currentSessionId;
        const position: WidgetPosition | undefined = afterWidgetId
          ? { after: afterWidgetId }
          : (moveTo ?? (movesSession ? "last" : undefined));

        placeWidget(widgetId, { layout: toPlacementLayout(input), sessionId, position });
        return `Updated the layout of widget ${widgetId}.`;
      },
    },
    [widgets, sessions, layouts, widgetToSession, placeWidget],
  );

  return null;
}
