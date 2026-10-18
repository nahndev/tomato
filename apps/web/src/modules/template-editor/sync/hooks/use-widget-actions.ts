"use client";

import type { Widget, WidgetProperties } from "@tomato/types";
import { useHandler, useTransaction } from "@/shared/lib/sync";
import { WidgetHandler } from "../handlers/widget-handler";

export interface WidgetActions {
  addWidget: (id: Widget["id"], type: Widget["type"], before: Widget | null) => void;
  removeWidget: (widgetId: string) => void;
  setProperties: (widgetId: string, properties: Partial<WidgetProperties>) => void;
  setProperty: <K extends keyof WidgetProperties>(widgetId: string, key: K, value: WidgetProperties[K]) => void;
}

export function useWidgetActions(): WidgetActions {
  const widgetHandler = useHandler(WidgetHandler);
  const transact = useTransaction();

  return {
    addWidget: (id, type, before) => transact(() => widgetHandler.addWidget(id, type, before)),
    setProperties: (widgetId, properties) => transact(() => widgetHandler.setProperties(widgetId, properties)),
    removeWidget: (widgetId) => transact(() => widgetHandler.removeWidget(widgetId)),
    setProperty: (widgetId, key, value) => transact(() => widgetHandler.setProperty(widgetId, key, value)),
  };
}
