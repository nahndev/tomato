"use client";

import { Input } from "@tomato/ui";
import { useRequiredText } from "../../hooks/use-required-text";
import { useSessionState } from "../../hooks/use-session-state";
import { useSessionActions } from "../../sync/hooks/use-session-actions";
import { useSessionId } from "./session-provider";

export function SessionNameInput() {
  const sessionId = useSessionId();
  const { session } = useSessionState();
  const { updateSession } = useSessionActions();
  const { text, setText, isInvalid, commit } = useRequiredText(session?.name, (name) =>
    updateSession(sessionId, { name }),
  );

  return (
    <div className="min-w-0 flex-1">
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={commit}
        aria-label="Session name"
        aria-invalid={isInvalid}
        placeholder="Session name…"
        className="h-auto border-transparent bg-transparent px-1.5 py-0.5 text-2xl font-medium"
      />
      {isInvalid && <p className="px-1.5 text-xs text-danger">Session name is required</p>}
    </div>
  );
}
