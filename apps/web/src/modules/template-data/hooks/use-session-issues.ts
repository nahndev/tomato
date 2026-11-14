"use client";

import type { z } from "zod";
import { SessionValidationStore } from "../components/session-validation-provider";

export function useSessionIssues(): z.core.$ZodIssue[] {
  return SessionValidationStore.useSelector((state) => state.issues);
}
