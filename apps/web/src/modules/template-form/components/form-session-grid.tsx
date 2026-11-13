"use client";

import { ContainerLayout } from "@tomato/grid";
import { toScopedKey, useDataScope } from "@/modules/template-data";
import { useMemo } from "react";
import { pickBy } from "remeda";
import { useTemplateForm } from "./template-form-provider";
import { FormWidgetItem } from "./widget/form-widget-item";

interface FormSessionGridProps {
  sessionId: string;
  /** A container widget's content: its own grid inside the widget. */
  isNested?: boolean;
  columnWidth?: number;
}

export function FormSessionGrid({ sessionId, isNested, columnWidth }: FormSessionGridProps) {
  const { snapshot } = useTemplateForm();
  const containerId = toScopedKey([...useDataScope(), sessionId]);
  const layouts = useMemo(
    () => pickBy(snapshot.layouts, (_, widgetId) => snapshot.widgetToSession[widgetId] === sessionId),
    [snapshot.layouts, snapshot.widgetToSession, sessionId],
  );

  return (
    <ContainerLayout id={containerId} layouts={layouts} isNested={isNested} isDisabled options={{ columnWidth }}>
      {(id: string) => {
        const widget = snapshot.widgets[id];
        return widget ? <FormWidgetItem key={id} widget={widget} /> : null;
      }}
    </ContainerLayout>
  );
}
