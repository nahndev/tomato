"use client";

import type { WidgetContainerProps } from "@/modules/template-widget";
import { useTemplateState } from "../../hooks/use-template-state";
import { SessionCanvas } from "./session-canvas";
import { SessionProvider } from "./session-provider";

export function NestedSessionCanvas({ containerId, columnWidth }: WidgetContainerProps) {
  const { widgets } = useTemplateState();
  const sessionId = widgets[containerId]?.session?.id;
  if (!sessionId) return null;

  return (
    <SessionProvider sessionId={sessionId}>
      <SessionCanvas isNested columnWidth={columnWidth} />
    </SessionProvider>
  );
}
