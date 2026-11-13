"use client";

import { useMemo, type ReactNode } from "react";
import { createStoreContext } from "@tomato/store-context";

export const DataScopeStore = createStoreContext<{ scope: readonly string[] }>("DataScope", { defaults: { scope: [] } });

interface DataScopeProviderProps {
  /** Appended to the enclosing scope, e.g. `[mixedViewId, tabSessionId]`. */
  scope: readonly string[];
  children: ReactNode;
}

export function DataScopeProvider({ scope, children }: DataScopeProviderProps) {
  const parent = DataScopeStore.useSelector((state) => state.scope);
  const value = useMemo(() => [...parent, ...scope], [parent, scope]);
  return <DataScopeStore.Provider scope={value}>{children}</DataScopeStore.Provider>;
}
