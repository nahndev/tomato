"use client";

import { useContext } from "react";
import { TemplateStoreContext } from "../components/template-store-provider";

/** The value stored under exactly this scoped key (see `toScopedKey`). */
export function useScopedValue(key: string): unknown {
  return useContext(TemplateStoreContext).values?.[key];
}
