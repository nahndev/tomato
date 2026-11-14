"use client";

import type { SubmissionDependency } from "@/modules/submission-dependency";
import { useEffect, useMemo, useState } from "react";
import { REFER_SUBMISSION_APPLY_TIMEOUT_MS } from "../../../template-widget.constants";
import { getPendingReferKeys, getReferSteps } from "./refer-submission";

interface ReferApplyInput {
  refer?: string;
  usersValue: unknown;
  dependencies: SubmissionDependency[];
}

export function useReferApply({ refer, usersValue, dependencies }: ReferApplyInput, onChange?: (value: string) => void) {
  const [applied, setApplied] = useState<{ usersValue: unknown }>();
  const applyingKeys = useMemo(
    () => (applied ? getPendingReferKeys(getReferSteps(refer, applied.usersValue, dependencies)) : new Set<string>()),
    [applied, refer, dependencies],
  );
  if (applied && applyingKeys.size === 0) setApplied(undefined);

  useEffect(() => {
    if (!applied) return;
    const timer = setTimeout(() => setApplied(undefined), REFER_SUBMISSION_APPLY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [applied]);

  const apply = () => {
    setApplied({ usersValue });
    onChange?.(new Date().toISOString());
  };

  return { applyingKeys, isApplying: applyingKeys.size > 0, apply };
}
