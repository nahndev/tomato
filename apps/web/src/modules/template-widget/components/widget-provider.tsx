"use client";

import { createStoreContext } from "@tomato/store-context";

const WidgetIdStore = createStoreContext<{ widgetId: string }>("WidgetId");

export const WidgetProvider = WidgetIdStore.Provider;

export function useWidgetId(): string {
  return WidgetIdStore.useSelector((state) => state.widgetId);
}
