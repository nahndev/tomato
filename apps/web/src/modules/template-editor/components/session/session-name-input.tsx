"use client";

import { Input, Typography } from "@tomato/ui";
import { useRequiredText } from "../../hooks/use-required-text";
import { useSessionSnapshot } from "../../hooks/use-session-snapshot";
import { useSessionActions } from "../../sync/hooks/use-session-actions";
import { useSessionId } from "../provider/session-id-provider";

export function SessionNameInput() {
  const sessionId = useSessionId();
  const { session } = useSessionSnapshot();
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
        className="h-auto rounded-md border-transparent bg-transparent px-1 py-0.5 text-sm font-medium text-muted-foreground focus-visible:text-foreground"
      />
      {isInvalid && <Typography as="p" className="px-1 text-xs text-danger">Session name is required</Typography>}
    </div>
  );
}
