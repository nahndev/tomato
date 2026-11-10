"use client";

import { ScrollArea } from "@tomato/ui";
import { useTemplateStateBaseSessions } from "../../hooks/use-template-state-base-sessions";
import { TemplateMode } from "../../template-editor.constants";
import { useTemplateMode } from "../provider/template-builder-provider";
import { SessionBox } from "../session/session-box";
import { SessionCreation } from "../session/session-creation";

export function TemplateCanvas() {
  const sessions = useTemplateStateBaseSessions();
  const mode = useTemplateMode();

  return (
    <ScrollArea className="size-full bg-muted">
      <div className="flex flex-col gap-10 p-10">
        {sessions.map((session) => (
          <SessionBox key={session.id} sessionId={session.id} />
        ))}
        {mode === TemplateMode.EDIT && <SessionCreation />}
      </div>
    </ScrollArea>
  );
}
