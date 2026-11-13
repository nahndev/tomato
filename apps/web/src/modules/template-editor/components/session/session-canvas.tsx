"use client";

import { ContainerLayout } from "@tomato/grid";
import { useCallback } from "react";
import { useSessionState } from "../../hooks/use-session-state";
import { useTemplateState } from "../../hooks/use-template-state";
import { TemplateMode } from "../../template-editor.constants";
import { useSessionActions } from "../../sync/hooks/use-session-actions";
import { canNestWidget } from "../../utils/container";
import { useTemplateMode } from "../provider/template-builder-provider";
import { WidgetItem } from "../widget/widget-item";
import { useSessionId } from "./session-provider";

interface SessionCanvasProps {
  /** A container widget's content: its own grid inside the widget. */
  isNested?: boolean;
  columnWidth?: number;
  isDisabled?: boolean;
}

export function SessionCanvas({ isNested, columnWidth, isDisabled }: SessionCanvasProps) {
  const mode = useTemplateMode();
  const sessionId = useSessionId();
  const { layouts, widgets } = useSessionState();
  const { widgets: allWidgets } = useTemplateState();
  const { updateLayout } = useSessionActions();

  const accept = useCallback((id: string) => canNestWidget(allWidgets[id]?.type), [allWidgets]);

  const handleMoving = useCallback(
    (id: string, column: number, idx: string) => updateLayout(id, sessionId, { column, idx }),
    [updateLayout, sessionId],
  );

  const handleResize = useCallback(
    (id: string, span: number) => updateLayout(id, sessionId, { span }),
    [updateLayout, sessionId],
  );

  return (
    <ContainerLayout
      id={sessionId}
      layouts={layouts}
      onMoving={handleMoving}
      onResize={handleResize}
      isNested={isNested}
      accept={isNested ? accept : undefined}
      isDisabled={isDisabled || mode === TemplateMode.VIEW}
      options={{ isGridVisible: mode === TemplateMode.EDIT, columnWidth }}
    >
      {(id: string) => (widgets[id] ? <WidgetItem key={id} widget={widgets[id]} /> : null)}
    </ContainerLayout>
  );
}
