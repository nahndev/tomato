"use client";

import { ContainerLayout } from "@tomato/grid";
import { toScopedKey, useDataScope } from "@/modules/template-data";
import { useMemo } from "react";
import { pickBy } from "remeda";
import { useTemplateForm } from "./template-form-provider";
import { FormWidgetItem } from "./widget/form-widget-item";

interface SessionFormGridProps {
  sessionId: string;
  /** A container widget's content: its own grid inside the widget. */
  isNested?: boolean;
  columnWidth?: number;
}

export function SessionFormGrid({ sessionId, isNested, columnWidth }: SessionFormGridProps) {
  const snapshot = useTemplateForm((state) => state.snapshot);
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
