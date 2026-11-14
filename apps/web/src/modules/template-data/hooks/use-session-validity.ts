"use client";

import { SessionValidationStore } from "../components/session-validation-provider";

export function useSessionValidity(): boolean | undefined {
  return SessionValidationStore.useSelector((state) => state.isValid);
}
