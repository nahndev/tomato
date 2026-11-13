"use client";

import type { WidgetReferences } from "@/modules/template-store";
import { useIsReferApplying } from "@/modules/template-widget";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { getPendingReferAppliedAt } from "../utils/refer-submission";

/** Whether a refer submission apply was sent and its changes are not visible yet. */
export function useIsReferPending(
  snapshot: TemplateSnapshot,
  values: Record<string, unknown>,
  references: WidgetReferences,
): boolean {
  return useIsReferApplying(getPendingReferAppliedAt(snapshot, values, references));
}
