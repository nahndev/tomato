"use client";

import { TemplateDataStore } from "../components/template-data-provider";

/** The value stored under exactly this scoped key (see `toScopedKey`). */
export function useScopedValue(key: string): unknown {
  return TemplateDataStore.useSelector((state) => state.values?.[key]);
}
