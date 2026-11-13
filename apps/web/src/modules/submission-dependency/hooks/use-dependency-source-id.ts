"use client";

import { useDependencyGraph } from "../components/dependency-graph-provider";

/** The submission the dependencies belong to; undefined outside a submission (e.g. in the template editor). */
export function useDependencySourceId(): string | undefined {
  return useDependencyGraph((state) => state.sourceId);
}
