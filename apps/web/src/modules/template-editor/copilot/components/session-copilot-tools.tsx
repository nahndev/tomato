"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { generateId } from "@tomato/utils";
import { z } from "zod";
import { useTopLevelSessions } from "../../hooks/use-top-level-sessions";
import { useSessionActions } from "../../sync/hooks/use-session-actions";
import {
  sessionPatchInputSchema,
  sessionPropertiesInputSchema,
  toSessionPatch,
  toSessionProperties,
} from "../utils/session-input";

const updateSessionParameters = sessionPatchInputSchema.extend({
  sessionId: z.string().describe("Id of the session to change."),
});

const removeSessionParameters = z.object({
  sessionId: z.string().describe("Id of the session to remove."),
});

export function SessionCopilotTools() {
  const baseSessions = useTopLevelSessions();
  const { addSession, updateSession, removeSession } = useSessionActions();

  useFrontendTool(
    {
      name: "addSession",
      description:
        "Add a new, empty session (wizard step) after the last one. Widgets are put in it afterwards with `setWidgetLayout`.",
      parameters: sessionPropertiesInputSchema,
      handler: async (input) => {
        const id = generateId();
        addSession(id, toSessionProperties(input));
        return `Added session "${input.name.trim()}" with id ${id}.`;
      },
    },
    [addSession],
  );

  useFrontendTool(
    {
      name: "updateSession",
      description:
        "Change a session's name, icon or description. Only the fields given change; an empty description clears it.",
      parameters: updateSessionParameters,
      handler: async ({ sessionId, ...input }) => {
        if (!baseSessions.some((session) => session.id === sessionId)) return `Error: no session with id "${sessionId}".`;
        const patch = toSessionPatch(input);
        if (Object.keys(patch).length === 0) return "Error: give at least one of `name`, `icon` or `description`.";
        updateSession(sessionId, patch);
        return `Updated session ${sessionId}.`;
      },
    },
    [baseSessions, updateSession],
  );

  useFrontendTool(
    {
      name: "removeSession",
      description:
        "Remove a session together with every widget in it. A template must keep at least one session. Move widgets out first with `setWidgetLayout` to keep them.",
      parameters: removeSessionParameters,
      handler: async ({ sessionId }) => {
        const session = baseSessions.find((item) => item.id === sessionId);
        if (!session) return `Error: no session with id "${sessionId}".`;
        if (baseSessions.length <= 1) return "Error: a template must keep at least one session.";
        removeSession(sessionId);
        return `Removed session "${session.name}" (${sessionId}) and its widgets.`;
      },
    },
    [baseSessions, removeSession],
  );

  return null;
}
