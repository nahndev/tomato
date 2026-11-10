"use client";

import { ContainerLayout } from "@tomato/grid";
import type { TemplateSnapshot } from "@tomato/types";
import { WidgetView, type WidgetContainerProps } from "@/modules/template-widget";
import { createContext, useContext, useMemo } from "react";
import { pickBy } from "remeda";

export interface FormState {
  snapshot: TemplateSnapshot;
  values: Record<string, unknown>;
  onChange: (widgetId: string, value: unknown) => void;
}

const FormStateContext = createContext<FormState | null>(null);

export const FormStateProvider = FormStateContext.Provider;

export function FormContainer({ containerId, columnWidth }: WidgetContainerProps) {
  const state = useContext(FormStateContext);
  if (!state) throw new Error("FormContainer must be used inside <FormStateProvider>");
  const { snapshot, values, onChange } = state;
  const sessionId = snapshot.widgets[containerId]?.session?.id;

  const layouts = useMemo(
    () => pickBy(snapshot.layouts, (_, widgetId) => sessionId !== undefined && snapshot.widgetToSession[widgetId] === sessionId),
    [snapshot.layouts, snapshot.widgetToSession, sessionId],
  );

  if (!sessionId) return null;

  return (
    <ContainerLayout
      id={sessionId}
      layouts={layouts}
      isNested
      isDisabled
      options={{ columnWidth }}
    >
      {(id: string) => {
        const widget = snapshot.widgets[id];
        return widget ? (
          <WidgetView key={id} widget={widget} value={values[id]} onChange={(next) => onChange(id, next)} />
        ) : null;
      }}
    </ContainerLayout>
  );
}
