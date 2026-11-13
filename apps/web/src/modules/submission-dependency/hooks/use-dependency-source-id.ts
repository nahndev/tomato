"use client";

import { useContext } from "react";
import { DependencyGraphContext } from "../components/dependency-graph-provider";

/** The submission the dependencies belong to; undefined outside a submission (e.g. in the template editor). */
export function useDependencySourceId(): string | undefined {
  return useContext(DependencyGraphContext)?.sourceId;
}
