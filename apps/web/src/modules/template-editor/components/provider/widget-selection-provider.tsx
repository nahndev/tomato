"use client";

import type { Widget } from "@/shared/types/template.types";
import { createStoreContext } from "@tomato/store-context";
import { useTemplateSnapshot } from "./template-snapshot-provider";

interface WidgetSelectionState {
  selectedId: string | null;
  select: (widgetId: string | null) => void;
  toggle: (widgetId: string) => void;
}

const WidgetSelectionStore = createStoreContext<object, WidgetSelectionState>("WidgetSelection", {
  initState: (set, get) => ({
    selectedId: null,
    select: (widgetId) => set({ selectedId: widgetId }),
    toggle: (widgetId) => set({ selectedId: get().selectedId === widgetId ? null : widgetId }),
  }),
});

export const WidgetSelectionProvider = WidgetSelectionStore.Provider;

/** Null when nothing is selected or the selected widget was removed. */
export function useSelectedWidget(): Widget | null {
  const selectedId = WidgetSelectionStore.useSelector((state) => state.selectedId);
  return useTemplateSnapshot((snapshot) => (selectedId ? (snapshot.widgets[selectedId] ?? null) : null));
}

export function useIsWidgetSelected(widgetId: string): boolean {
  return WidgetSelectionStore.useSelector((state) => state.selectedId === widgetId);
}

export function useSelectWidget(): WidgetSelectionState["select"] {
  return WidgetSelectionStore.useSelector((state) => state.select);
}

export function useToggleWidget(): WidgetSelectionState["toggle"] {
  return WidgetSelectionStore.useSelector((state) => state.toggle);
}
