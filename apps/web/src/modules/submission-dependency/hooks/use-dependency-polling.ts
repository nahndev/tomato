"use client";

import { useEffect } from "react";
import { useDependencyGraph } from "../components/dependency-graph-provider";

/** Keeps the graph polled while `isActive`, e.g. until the changes an action asked for show up. */
export function useDependencyPolling(isActive: boolean): void {
  const requestPolling = useDependencyGraph((state) => state.requestPolling);

  useEffect(() => {
    if (isActive && requestPolling) return requestPolling();
  }, [isActive, requestPolling]);
}
