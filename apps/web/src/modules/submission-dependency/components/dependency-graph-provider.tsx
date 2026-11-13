"use client";

import { useCallback, useState, type ReactNode } from "react";
import { createStoreContext } from "@tomato/store-context";
import { useSubmissionGraph } from "../hooks/use-submission-graph";
import { DEPENDENCY_POLL_MS } from "../submission-dependency.constants";
import type { DependencyGraphValue } from "../submission-dependency.types";

/** Empty outside a submission (e.g. in the template editor). */
const DependencyGraphStore = createStoreContext<Partial<DependencyGraphValue>>("DependencyGraph", { defaults: {} });

/** Takes the graph as props; `DependencyGraphProvider` loads it. */
export const DependencyGraphValueProvider = DependencyGraphStore.Provider;

export const useDependencyGraph = DependencyGraphStore.useSelector;

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

  return (
    <DependencyGraphValueProvider sourceId={sourceId} graph={graph} requestPolling={requestPolling}>
      {children}
    </DependencyGraphValueProvider>
  );
}
