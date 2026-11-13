"use client";

import { useContext } from "react";
import { TemplateDataContext } from "../components/template-data-provider";

/** The value stored under exactly this scoped key (see `toScopedKey`). */
export function useScopedValue(key: string): unknown {
  return useContext(TemplateDataContext).values?.[key];
}
