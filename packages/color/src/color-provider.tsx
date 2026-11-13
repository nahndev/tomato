"use client";

import { useCallback } from "react";
import { createStoreContext } from "@tomato/store-context";
import { pickRandomColor } from "./color.utils";

const ColorStore = createStoreContext<{ presets: readonly string[] }>("Color", { defaults: { presets: [] } });

export const ColorProvider = ColorStore.Provider;

/** Presets of the nearest `ColorProvider`; empty outside one. */
export function useColors(): readonly string[] {
  return ColorStore.useSelector((state) => state.presets);
}

/** Picks a preset; `undefined` when there are none. */
export function useRandomColor(): () => string | undefined {
  const colors = useColors();
  return useCallback(() => pickRandomColor(colors), [colors]);
}
