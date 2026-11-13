"use client";

import { useEffect, useState } from "react";
import { REFER_SUBMISSION_APPLY_TIMEOUT_MS } from "../template-form.constants";

/** Whether an apply sent at `appliedAt` (ISO time) may still be running. */
export function useIsReferApplying(appliedAt: unknown): boolean {
  const deadline = typeof appliedAt === "string" ? Date.parse(appliedAt) + REFER_SUBMISSION_APPLY_TIMEOUT_MS : NaN;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const delay = deadline - Date.now();
    if (!(delay > 0)) return;
    const timer = setTimeout(() => setNow(Date.now()), delay);
    return () => clearTimeout(timer);
  }, [deadline]);

  return deadline > now;
}
