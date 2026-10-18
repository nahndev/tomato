"use client";

import { ContainerLayout } from "@tomato/grid";
import { useCallback } from "react";
import { useSessionState } from "../../hooks/use-session-state";
import { TemplateMode } from "../../template-editor.constants";
import { useSessionActions } from "../../sync/hooks/use-session-actions";
import { useTemplateMode } from "../provider/template-builder-provider";
import { WidgetItem } from "../widget/widget-item";
import { useSessionId } from "./session-provider";

export function SessionCanvas() {
  const mode = useTemplateMode();
  const sessionId = useSessionId();
  const { layouts, widgets } = useSessionState();
  const { updateLayout } = useSessionActions();

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
      isDisabled={mode === TemplateMode.VIEW}
      options={{ isGridVisible: mode === TemplateMode.EDIT }}
    >
      {(id: string) => (widgets[id] ? <WidgetItem key={id} widget={widgets[id]} /> : null)}
    </ContainerLayout>
  );
}
