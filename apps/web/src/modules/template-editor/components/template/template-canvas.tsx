"use client";

import { ScrollArea } from "@tomato/ui";
import { useTemplateState } from "../../hooks/use-template-state";
import { TemplateMode } from "../../template-editor.constants";
import { useTemplateMode } from "../provider/template-builder-provider";
import { SessionBox } from "../session/session-box";
import { SessionCreation } from "../session/session-creation";

export function TemplateCanvas() {
  const { sessions } = useTemplateState();
  const mode = useTemplateMode();

  return (
    <ScrollArea className="size-full bg-muted">
      <div className="flex flex-col gap-10 p-10">
        {Object.values(sessions).map((session) => (
          <SessionBox key={session.id} sessionId={session.id} />
        ))}
        {mode === TemplateMode.EDIT && <SessionCreation />}
      </div>
    </ScrollArea>
  );
}
