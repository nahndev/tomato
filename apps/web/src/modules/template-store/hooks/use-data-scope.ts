"use client";

import { useContext } from "react";
import { DataScopeContext } from "../components/data-scope-provider";

/** Path of the widgets' values under here; empty at the top level. */
export function useDataScope(): readonly string[] {
  return useContext(DataScopeContext);
}
