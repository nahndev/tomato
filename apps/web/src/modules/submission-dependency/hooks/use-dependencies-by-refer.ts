"use client";

import { useMemo } from "react";
import { useDependencyGraph } from "../components/dependency-graph-provider";
import type { SubmissionDependency } from "../submission-dependency.types";

const NONE: SubmissionDependency[] = [];

/** The source's dependencies created under `refer`. */
export function useDependenciesByRefer(refer: string | undefined): SubmissionDependency[] {
  const sourceId = useDependencyGraph((state) => state.sourceId);
  const edges = useDependencyGraph((state) => state.graph?.edges);

  return useMemo(() => {
    if (!refer || !edges) return NONE;
    return edges.filter((edge) => edge.sourceId === sourceId && edge.refer === refer);
  }, [edges, sourceId, refer]);
}
