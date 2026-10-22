"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { generateId } from "@tomato/utils";
import { z } from "zod";
import { useTemplateState } from "../../hooks/use-template-state";
import { useSessionActions } from "../hooks/use-session-actions";
import {
  sessionPatchInput,
  sessionPropertiesInput,
  toSessionPatch,
  toSessionProperties,
} from "./copilot-session";

const updateSessionParameters = sessionPatchInput.extend({
  sessionId: z.string().describe("Id of the session to change."),
});

const removeSessionParameters = z.object({
  sessionId: z.string().describe("Id of the session to remove."),
});

/** Registers the tools that add, edit and remove sessions (wizard steps). Renders nothing. */
export function SessionCopilotFunctions() {
  const { sessions } = useTemplateState();
  const { addSession, updateSession, removeSession } = useSessionActions();

  useFrontendTool(
    {
      name: "addSession",
      description:
        "Add a new, empty session (wizard step) after the last one. Widgets are put in it afterwards with `setWidgetLayout`.",
      parameters: sessionPropertiesInput,
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
        if (!sessions[sessionId]) return `Error: no session with id "${sessionId}".`;
        const patch = toSessionPatch(input);
        if (Object.keys(patch).length === 0) return "Error: give at least one of `name`, `icon` or `description`.";
        updateSession(sessionId, patch);
        return `Updated session ${sessionId}.`;
      },
    },
    [sessions, updateSession],
  );

  useFrontendTool(
    {
      name: "removeSession",
      description:
        "Remove a session together with every widget in it. A template must keep at least one session. Move widgets out first with `setWidgetLayout` to keep them.",
      parameters: removeSessionParameters,
      handler: async ({ sessionId }) => {
        const session = sessions[sessionId];
        if (!session) return `Error: no session with id "${sessionId}".`;
        if (Object.keys(sessions).length <= 1) return "Error: a template must keep at least one session.";
        removeSession(sessionId);
        return `Removed session "${session.name}" (${sessionId}) and its widgets.`;
      },
    },
    [sessions, removeSession],
  );

  return null;
}
