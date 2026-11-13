"use client";

import type { ReactNode } from "react";
import { createStoreContext } from "@tomato/store-context";
import { useSubmissionGraph } from "../hooks/use-submission-graph";
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

/** Loads the graph of `sourceId` for the dependency hooks inside. */
export function DependencyGraphProvider({ sourceId, children }: DependencyGraphProviderProps) {
  const { data: graph } = useSubmissionGraph(sourceId);

  return (
    <DependencyGraphValueProvider sourceId={sourceId} graph={graph}>
      {children}
    </DependencyGraphValueProvider>
  );
}
