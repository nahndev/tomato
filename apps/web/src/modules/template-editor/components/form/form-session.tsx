"use client";

import type { Session, TemplateSnapshot } from "@tomato/types";
import { ContainerLayout } from "@tomato/grid";
import { useMemo } from "react";
import { pickBy } from "remeda";
import { EditorIcon } from "../editor-icon";
import { FormWidget } from "./form-widget";

interface FormSessionProps {
  session: Session;
  snapshot: TemplateSnapshot;
  values: Record<string, unknown>;
  onChange: (widgetId: string, value: unknown) => void;
}

export function FormSession({ session, snapshot, values, onChange }: FormSessionProps) {
  const layouts = useMemo(
    () => pickBy(snapshot.layouts, (_, widgetId) => snapshot.widgetToSession[widgetId] === session.id),
    [snapshot.layouts, snapshot.widgetToSession, session.id],
  );

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg bg-card p-4 text-foreground shadow-card">
        <div className="flex items-center gap-2 border-b border-border p-2">
          <EditorIcon icon={session.icon} className="size-4 text-muted-foreground" />
          <p className="font-medium">{session.name}</p>
        </div>
        <ContainerLayout id={session.id} layouts={layouts} isDisabled>
          {(id: string) => {
            const widget = snapshot.widgets[id];
            return widget ? <FormWidget key={id} widget={widget} value={values[id]} onChange={onChange} /> : null;
          }}
        </ContainerLayout>
      </div>
    </div>
  );
}
