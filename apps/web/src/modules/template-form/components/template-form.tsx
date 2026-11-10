"use client";

import { DragDropProvider } from "@dnd-kit/react";
import type { TemplateSnapshot } from "@tomato/types";
import { ScrollArea } from "@tomato/ui";
import { WidgetContainerProvider } from "@/modules/template-widget";
import { useMemo } from "react";
import { evaluateSessionCondition } from "../utils/session-condition";
import { FormContainer, FormStateProvider } from "./form-container";
import { FormSession } from "./form-session";

interface TemplateFormProps {
  snapshot: TemplateSnapshot;
  values: Record<string, unknown>;
  onChange: (widgetId: string, value: unknown) => void;
}

export function TemplateForm({ snapshot, values, onChange }: TemplateFormProps) {
  const sessions = Object.values(snapshot.sessions).filter((session) =>
    evaluateSessionCondition(session.condition, values),
  );
  const formState = useMemo(() => ({ snapshot, values, onChange }), [snapshot, values, onChange]);

  return (
    <DragDropProvider>
      <FormStateProvider value={formState}>
        <WidgetContainerProvider value={FormContainer}>
          <ScrollArea className="size-full bg-muted">
            <div className="flex flex-col gap-10 p-10">
              {sessions.map((session) => (
                <FormSession
                  key={session.id}
                  session={session}
                  snapshot={snapshot}
                  values={values}
                  onChange={onChange}
                />
              ))}
            </div>
          </ScrollArea>
        </WidgetContainerProvider>
      </FormStateProvider>
    </DragDropProvider>
  );
}
