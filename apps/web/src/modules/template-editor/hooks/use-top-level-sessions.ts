"use client";

import type { Session } from "@/shared/types/template.types";
import { useMemo } from "react";
import { useTemplateSnapshot } from "../components/provider/template-snapshot-provider";

/** The template's sessions (sections). A canvas's content session lives in the canvas widget, not here. */
export function useTopLevelSessions(): Session[] {
  const sessions = useTemplateSnapshot((snapshot) => snapshot.sessions);
  return useMemo(() => Object.values(sessions), [sessions]);
}
