"use client";

import { DragDropProvider } from "@dnd-kit/react";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { ScrollArea } from "@tomato/ui";
import { TemplateStoreProvider } from "@/modules/template-store";
import { useMemo } from "react";
import { evaluateSessionCondition } from "../utils/session-condition";
import { FormStateProvider, type FormState } from "./form-container";
import { FormSession } from "./form-session";

interface TemplateFormProps {
  snapshot: TemplateSnapshot;
  values: Record<string, unknown>;
  onChange: FormState["onChange"];
}

export function TemplateForm({ snapshot, values, onChange }: TemplateFormProps) {
  const sessions = Object.values(snapshot.sessions).filter((session) =>
    evaluateSessionCondition(session.condition, values),
  );
  const formState = useMemo(() => ({ snapshot, onChange }), [snapshot, onChange]);
  const storeValue = useMemo(
    () => ({ widgets: snapshot.widgets, links: snapshot.links, values }),
    [snapshot.widgets, snapshot.links, values],
  );

  return (
    <DragDropProvider>
      <FormStateProvider value={formState}>
        <TemplateStoreProvider value={storeValue}>
          <ScrollArea className="size-full bg-muted">
          <div className="flex flex-col gap-10 p-10">
            {sessions.map((session) => (
              <FormSession key={session.id} session={session} snapshot={snapshot} />
            ))}
          </div>
          </ScrollArea>
        </TemplateStoreProvider>
      </FormStateProvider>
    </DragDropProvider>
  );
}
