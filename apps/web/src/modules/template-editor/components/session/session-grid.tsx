"use client";

import { ContainerLayout } from "@tomato/grid";
import { useCallback } from "react";
import { useSessionSnapshot } from "../../hooks/use-session-snapshot";
import { useTemplateSnapshot } from "../provider/template-snapshot-provider";
import { TemplateMode } from "../../template-editor.constants";
import { useSessionActions } from "../../sync/hooks/use-session-actions";
import { canNestWidget } from "../../utils/container-widget";
import { useTemplateMode } from "../provider/template-mode-provider";
import { EditorWidgetItem } from "../widget/editor-widget-item";
import { useSessionId } from "../provider/session-id-provider";

interface SessionGridProps {
  /** A container widget's content: its own grid inside the widget. */
  isNested?: boolean;
  columnWidth?: number;
  isDisabled?: boolean;
}

export function SessionGrid({ isNested, columnWidth, isDisabled }: SessionGridProps) {
  const mode = useTemplateMode();
  const sessionId = useSessionId();
  const { layouts, widgets } = useSessionSnapshot();
  const { widgets: allWidgets } = useTemplateSnapshot();
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
      {(id: string) => (widgets[id] ? <EditorWidgetItem key={id} widget={widgets[id]} /> : null)}
    </ContainerLayout>
  );
}
