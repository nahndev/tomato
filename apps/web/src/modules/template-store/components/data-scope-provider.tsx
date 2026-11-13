"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

export const DataScopeContext = createContext<readonly string[]>([]);

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
