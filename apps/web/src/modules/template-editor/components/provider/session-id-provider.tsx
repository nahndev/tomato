"use client";

import { createStoreContext } from "@tomato/store-context";

const SessionIdStore = createStoreContext<{ sessionId: string }>("SessionId");

export const SessionIdProvider = SessionIdStore.Provider;

export function useSessionId(): string {
  return SessionIdStore.useSelector((state) => state.sessionId);
}
