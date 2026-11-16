"use client";

import type { Session } from "@/shared/types/template.types";
import { useMemo } from "react";
import * as R from "remeda";
import { useTemplateSnapshot } from "../components/provider/template-snapshot-provider";

/** The template's sessions (sections). A canvas's content session lives in the canvas widget, not here. */
export function useTopLevelSessions(): Session[] {
  const sessions = useTemplateSnapshot((snapshot) => snapshot.sessions);
  return useMemo(
    () => R.sortBy(Object.values(sessions), (session) => session.idx ?? "", (session) => session.id),
    [sessions],
  );
}
