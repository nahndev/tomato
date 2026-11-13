"use client";

import { ScrollArea } from "@tomato/ui";
import { useTopLevelSessions } from "../../hooks/use-top-level-sessions";
import { TemplateMode } from "../../template-editor.constants";
import { useTemplateMode } from "../provider/template-mode-provider";
import { SessionBox } from "./session-box";
import { AddSessionButton } from "./add-session-button";

export function SessionList() {
  const sessions = useTopLevelSessions();
  const mode = useTemplateMode();

  return (
    <ScrollArea className="size-full bg-muted">
      <div className="flex flex-col gap-10 p-10">
        {sessions.map((session) => (
          <SessionBox key={session.id} sessionId={session.id} />
        ))}
        {mode === TemplateMode.EDIT && <AddSessionButton />}
      </div>
    </ScrollArea>
  );
}
