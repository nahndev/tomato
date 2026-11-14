"use client";

import { TemplateDataProvider } from "@/modules/template-data";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { DragDropProvider } from "@dnd-kit/react";
import { ScrollArea } from "@tomato/ui";
import { evaluateSessionCondition } from "../utils/session-condition";
import { SessionFormBox } from "./session-form-box";
import {
  TemplateFormProvider,
  type TemplateFormState,
} from "./template-form-provider";

interface TemplateFormProps {
  snapshot: TemplateSnapshot;
  values: Record<string, unknown>;
  onChange: TemplateFormState["onChange"];
}

export function TemplateForm({
  snapshot,
  values,
  onChange,
}: TemplateFormProps) {
  const sessions = Object.values(snapshot.sessions).filter((session) =>
    evaluateSessionCondition(session.condition, values),
  );

  return (
    <DragDropProvider>
      <TemplateFormProvider snapshot={snapshot} onChange={onChange}>
        <TemplateDataProvider
          widgets={snapshot.widgets}
          links={snapshot.links}
          widgetToSession={snapshot.widgetToSession}
          values={values}
        >
          <ScrollArea className="size-full bg-muted">
            <div className="flex flex-col gap-10 p-10">
              {sessions.map((session) => (
                <SessionFormBox key={session.id} session={session} />
              ))}
            </div>
          </ScrollArea>
        </TemplateDataProvider>
      </TemplateFormProvider>
    </DragDropProvider>
  );
}
