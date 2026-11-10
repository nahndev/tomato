"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

const DataScopeContext = createContext<readonly string[]>([]);

interface DataScopeProviderProps {
  /** Appended to the enclosing scope, e.g. `[mixedViewId, tabSessionId]`. */
  scope: readonly string[];
  children: ReactNode;
}

export function DataScopeProvider({ scope, children }: DataScopeProviderProps) {
  const parent = useContext(DataScopeContext);
  const value = useMemo(() => [...parent, ...scope], [parent, scope]);
  return <DataScopeContext.Provider value={value}>{children}</DataScopeContext.Provider>;
}

/** Path of the widgets' values under here; empty at the top level. */
export function useDataScope(): readonly string[] {
  return useContext(DataScopeContext);
}
