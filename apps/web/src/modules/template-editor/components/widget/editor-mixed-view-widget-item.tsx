"use client";

import { useItemState } from "@tomato/grid";
import { MixedViewWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { SessionGrid } from "../session/session-grid";
import { SessionIdProvider } from "../provider/session-id-provider";

export function EditorMixedViewWidgetItem({ widget }: FieldComponentProps) {
  const isDragging = useItemState((state) => state.isDragging);

  return (
    <MixedViewWidgetItem widget={widget}>
      {(session, columnWidth) => (
        <SessionIdProvider sessionId={session.id}>
          <SessionGrid isNested columnWidth={columnWidth} isDisabled={isDragging} />
        </SessionIdProvider>
      )}
    </MixedViewWidgetItem>
  );
}
