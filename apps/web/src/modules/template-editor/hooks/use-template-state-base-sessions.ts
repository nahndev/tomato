"use client";

import type { Session } from "@tomato/types";
import { useMemo } from "react";
import { useTemplateState } from "./use-template-state";

/** The template's sessions (sections). A canvas's content session lives in the canvas widget, not here. */
export function useTemplateStateBaseSessions(): Session[] {
  const { sessions } = useTemplateState();
  return useMemo(() => Object.values(sessions), [sessions]);
}
