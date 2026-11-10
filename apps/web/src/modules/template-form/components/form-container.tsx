"use client";

import { WidgetType } from "@tomato/constants";
import { ContainerLayout } from "@tomato/grid";
import type { TemplateSnapshot } from "@tomato/types";
import { CanvasWidgetItem, WidgetComponent, WidgetView, type FieldComponentProps } from "@/modules/template-widget";
import { createContext, useContext, useMemo } from "react";
import { pickBy } from "remeda";

export interface FormState {
  snapshot: TemplateSnapshot;
  values: Record<string, unknown>;
  onChange: (widgetId: string, value: unknown) => void;
}

const FormStateContext = createContext<FormState | null>(null);

export const FormStateProvider = FormStateContext.Provider;

interface FormContainerProps {
  containerId: string;
  columnWidth: number;
}

function FormContainer({ containerId, columnWidth }: FormContainerProps) {
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
          <WidgetView key={id} widget={widget}>
            <FormWidget widget={widget} value={values[id]} onChange={(next) => onChange(id, next)} />
          </WidgetView>
        ) : null;
      }}
    </ContainerLayout>
  );
}

function FormCanvasWidgetItem({ widget }: FieldComponentProps) {
  return (
    <CanvasWidgetItem widget={widget}>
      {(columnWidth) => <FormContainer containerId={widget.id} columnWidth={columnWidth} />}
    </CanvasWidgetItem>
  );
}

export function FormWidget(props: FieldComponentProps) {
  if (props.widget.type === WidgetType.CANVAS) return <FormCanvasWidgetItem widget={props.widget} />;
  return <WidgetComponent {...props} />;
}
