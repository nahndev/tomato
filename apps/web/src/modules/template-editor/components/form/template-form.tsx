"use client";

import { DragDropProvider } from "@dnd-kit/react";
import type { TemplateSnapshot } from "@tomato/types";
import { ScrollArea } from "@tomato/ui";
import { evaluateSessionCondition } from "../../utils/session-condition";
import { FormSession } from "./form-session";

interface TemplateFormProps {
  snapshot: TemplateSnapshot;
  values: Record<string, unknown>;
  onChange: (widgetId: string, value: unknown) => void;
}

/** Fills in a published template: shows each session whose condition holds, with controlled widget values. */
export function TemplateForm({ snapshot, values, onChange }: TemplateFormProps) {
  const sessions = Object.values(snapshot.sessions).filter((session) =>
    evaluateSessionCondition(session.condition, values),
  );

  return (
    <DragDropProvider>
      <ScrollArea className="size-full bg-muted">
        <div className="flex flex-col gap-10 p-10">
          {sessions.map((session) => (
            <FormSession key={session.id} session={session} snapshot={snapshot} values={values} onChange={onChange} />
          ))}
        </div>
      </ScrollArea>
    </DragDropProvider>
  );
}
