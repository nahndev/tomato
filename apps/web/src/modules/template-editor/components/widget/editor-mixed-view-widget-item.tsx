"use client";

import { useItemState } from "@tomato/grid";
import { MixedViewWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { SessionCanvas } from "../session/session-canvas";
import { SessionProvider } from "../session/session-provider";

export function EditorMixedViewWidgetItem({ widget }: FieldComponentProps) {
  const { isDragging } = useItemState();

  return (
    <MixedViewWidgetItem widget={widget}>
      {(session, columnWidth) => (
        <SessionProvider sessionId={session.id}>
          <SessionCanvas isNested columnWidth={columnWidth} isDisabled={isDragging} />
        </SessionProvider>
      )}
    </MixedViewWidgetItem>
  );
}
