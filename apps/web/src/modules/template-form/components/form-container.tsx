"use client";

import { WidgetType } from "@tomato/constants";
import { ContainerLayout } from "@tomato/grid";
import type { TemplateSnapshot, Widget } from "@/shared/types/template.types";
import {
  CanvasWidgetItem,
  MixedViewWidgetItem,
  RepeatViewWidgetItem,
  WidgetComponent,
  WidgetView,
  type FieldComponentProps,
} from "@/modules/template-widget";
import { DataScopeProvider, toScopedKey, useDataScope, useScopedValue } from "@/modules/template-store";
import { createContext, useContext, useMemo } from "react";
import { pickBy } from "remeda";

export interface FormState {
  snapshot: TemplateSnapshot;
  /** `key` is the flat key of `scope` (the widget id at the top level); `scope` ends with the widget id. */
  onChange: (key: string, value: unknown, scope: string[]) => void;
}

const FormStateContext = createContext<FormState | null>(null);

export const FormStateProvider = FormStateContext.Provider;

function useFormState(): FormState {
  const state = useContext(FormStateContext);
  if (!state) throw new Error("useFormState must be used inside <FormStateProvider>");
  return state;
}

interface FormContainerProps {
  sessionId: string;
  columnWidth: number;
}

function FormContainer({ sessionId, columnWidth }: FormContainerProps) {
  const { snapshot } = useFormState();
  const containerId = toScopedKey([...useDataScope(), sessionId]);

  const layouts = useMemo(
    () => pickBy(snapshot.layouts, (_, widgetId) => snapshot.widgetToSession[widgetId] === sessionId),
    [snapshot.layouts, snapshot.widgetToSession, sessionId],
  );

  return (
    <ContainerLayout id={containerId} layouts={layouts} isNested isDisabled options={{ columnWidth }}>
      {(id: string) => {
        const widget = snapshot.widgets[id];
        return widget ? <FormField key={id} widget={widget} /> : null;
      }}
    </ContainerLayout>
  );
}

function FormCanvasWidgetItem({ widget }: FieldComponentProps) {
  const sessionId = widget.session?.id;

  return (
    <CanvasWidgetItem widget={widget}>
      {(columnWidth) => sessionId && <FormContainer sessionId={sessionId} columnWidth={columnWidth} />}
    </CanvasWidgetItem>
  );
}

function FormMixedViewWidgetItem({ widget }: FieldComponentProps) {
  return (
    <MixedViewWidgetItem widget={widget} isAllMounted>
      {(session, columnWidth) => (
        <DataScopeProvider scope={[widget.id, session.id]}>
          <FormContainer sessionId={session.id} columnWidth={columnWidth} />
        </DataScopeProvider>
      )}
    </MixedViewWidgetItem>
  );
}

function FormRepeatViewWidgetItem({ widget }: FieldComponentProps) {
  const sessionId = widget.session?.id;

  return (
    <RepeatViewWidgetItem widget={widget} isAllMounted>
      {(tab, columnWidth) =>
        sessionId && (
          <DataScopeProvider scope={[widget.id, tab.id]}>
            <FormContainer sessionId={sessionId} columnWidth={columnWidth} />
          </DataScopeProvider>
        )
      }
    </RepeatViewWidgetItem>
  );
}

function FormWidget(props: FieldComponentProps) {
  if (props.widget.type === WidgetType.CANVAS) return <FormCanvasWidgetItem widget={props.widget} />;
  if (props.widget.type === WidgetType.MIXED_VIEW) return <FormMixedViewWidgetItem widget={props.widget} />;
  if (props.widget.type === WidgetType.REPEAT_VIEW) return <FormRepeatViewWidgetItem widget={props.widget} />;
  return <WidgetComponent {...props} />;
}

/** A widget with its value, read and reported under the enclosing data scope. */
export function FormField({ widget }: { widget: Widget }) {
  const { onChange } = useFormState();
  const scope = [...useDataScope(), widget.id];
  const key = toScopedKey(scope);
  const value = useScopedValue(key);

  return (
    <WidgetView widget={widget}>
      <FormWidget widget={widget} value={value} onChange={(next) => onChange(key, next, scope)} />
    </WidgetView>
  );
}
