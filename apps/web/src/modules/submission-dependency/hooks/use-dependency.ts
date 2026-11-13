"use client";

import { useDependencyGraph } from "../components/dependency-graph-provider";
import type { SubmissionDependency } from "../submission-dependency.types";

/** The source's dependency with this idempotency key. */
export function useDependency(idempotencyKey: string | undefined): SubmissionDependency | undefined {
  return useDependencyGraph(({ sourceId, graph }) =>
    idempotencyKey
      ? graph?.edges.find((edge) => edge.sourceId === sourceId && edge.idempotencyKey === idempotencyKey)
      : undefined,
  );
}

export function useHasDependency(idempotencyKey: string | undefined): boolean {
  return useDependency(idempotencyKey) !== undefined;
}
