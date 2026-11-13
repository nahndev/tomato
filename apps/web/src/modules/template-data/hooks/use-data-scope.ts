"use client";

import { DataScopeStore } from "../components/data-scope-provider";

/** Path of the widgets' values under here; empty at the top level. */
export function useDataScope(): readonly string[] {
  return DataScopeStore.useSelector((state) => state.scope);
}
