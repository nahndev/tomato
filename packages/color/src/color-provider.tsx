"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { pickRandomColor } from "./color.utils";

const ColorContext = createContext<readonly string[]>([]);

export function ColorProvider({ presets, children }: { presets: readonly string[]; children: ReactNode }) {
  return <ColorContext.Provider value={presets}>{children}</ColorContext.Provider>;
}

/** Presets of the nearest `ColorProvider`; empty outside one. */
export function useColors(): readonly string[] {
  return useContext(ColorContext);
}

/** Picks a preset; `undefined` when there are none. */
export function useRandomColor(): () => string | undefined {
  const colors = useColors();
  return useCallback(() => pickRandomColor(colors), [colors]);
}
