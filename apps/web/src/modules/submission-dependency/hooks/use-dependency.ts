"use client";

import { useContext } from "react";
import { DependencyGraphContext } from "../components/dependency-graph-provider";
import type { SubmissionDependency } from "../submission-dependency.types";

/** The source's dependency with this idempotency key. */
export function useDependency(idempotencyKey: string | undefined): SubmissionDependency | undefined {
  const context = useContext(DependencyGraphContext);
  if (!idempotencyKey || !context) return undefined;
  return context.graph?.edges.find(
    (edge) => edge.sourceId === context.sourceId && edge.idempotencyKey === idempotencyKey,
  );
}

export function useHasDependency(idempotencyKey: string | undefined): boolean {
  return useDependency(idempotencyKey) !== undefined;
}
