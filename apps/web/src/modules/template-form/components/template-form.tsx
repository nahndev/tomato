"use client";

import { DragDropProvider } from "@dnd-kit/react";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { ScrollArea } from "@tomato/ui";
import { TemplateDataProvider } from "@/modules/template-data";
import { useMemo } from "react";
import { evaluateSessionCondition } from "../utils/session-condition";
import { FormSessionBox } from "./form-session-box";
import { TemplateFormProvider, type TemplateFormState } from "./template-form-provider";

interface TemplateFormProps {
  snapshot: TemplateSnapshot;
  values: Record<string, unknown>;
  onChange: TemplateFormState["onChange"];
}

export function TemplateForm({ snapshot, values, onChange }: TemplateFormProps) {
  const sessions = Object.values(snapshot.sessions).filter((session) =>
    evaluateSessionCondition(session.condition, values),
  );
  const formState = useMemo(() => ({ snapshot, onChange }), [snapshot, onChange]);
  const dataValue = useMemo(
    () => ({ widgets: snapshot.widgets, links: snapshot.links, values }),
    [snapshot.widgets, snapshot.links, values],
  );

  return (
    <DragDropProvider>
      <TemplateFormProvider value={formState}>
        <TemplateDataProvider value={dataValue}>
          <ScrollArea className="size-full bg-muted">
          <div className="flex flex-col gap-10 p-10">
            {sessions.map((session) => (
              <FormSessionBox key={session.id} session={session} />
            ))}
          </div>
          </ScrollArea>
        </TemplateDataProvider>
      </TemplateFormProvider>
    </DragDropProvider>
  );
}
