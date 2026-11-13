"use client";

import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { useSubmissionGraph } from "../hooks/use-submission-graph";
import { DEPENDENCY_POLL_MS } from "../submission-dependency.constants";
import type { DependencyGraphValue } from "../submission-dependency.types";

export const DependencyGraphContext = createContext<DependencyGraphValue | null>(null);

interface DependencyGraphProviderProps {
  sourceId: string;
  children: ReactNode;
}

/** Loads the graph of `sourceId` for the dependency hooks inside, polling it while any of them asks to. */
export function DependencyGraphProvider({ sourceId, children }: DependencyGraphProviderProps) {
  const [pollers, setPollers] = useState(0);
  const { data: graph } = useSubmissionGraph(sourceId, pollers > 0 && DEPENDENCY_POLL_MS);

  const requestPolling = useCallback(() => {
    setPollers((count) => count + 1);
    return () => setPollers((count) => count - 1);
  }, []);

  const value = useMemo(() => ({ sourceId, graph, requestPolling }), [sourceId, graph, requestPolling]);

  return <DependencyGraphContext.Provider value={value}>{children}</DependencyGraphContext.Provider>;
}
