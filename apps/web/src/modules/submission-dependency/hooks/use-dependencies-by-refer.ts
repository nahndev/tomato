"use client";

import { useContext, useMemo } from "react";
import { DependencyGraphContext } from "../components/dependency-graph-provider";
import type { SubmissionDependency } from "../submission-dependency.types";

const NONE: SubmissionDependency[] = [];

/** The source's dependencies created under `refer`. */
export function useDependenciesByRefer(refer: string | undefined): SubmissionDependency[] {
  const context = useContext(DependencyGraphContext);
  const sourceId = context?.sourceId;
  const edges = context?.graph?.edges;

  return useMemo(() => {
    if (!refer || !edges) return NONE;
    return edges.filter((edge) => edge.sourceId === sourceId && edge.refer === refer);
  }, [edges, sourceId, refer]);
}
