"use client";

import { createContext, useCallback, useContext, useEffect } from "react";
import type { SyncDoc } from "./sync-doc";
import type { EventConstructor, SyncEvent } from "./sync-event";

const SyncDocContext = createContext<SyncDoc | null>(null);

export const SyncDocProvider = SyncDocContext.Provider;

export function useSyncDoc(): SyncDoc {
  const syncDoc = useContext(SyncDocContext);
  if (!syncDoc) throw new Error("useSyncDoc must be used inside <SyncDocProvider>");
  return syncDoc;
}

export function useHandler<T extends object>(ctor: new (...args: never[]) => T): T {
  return useSyncDoc().getHandler(ctor);
}

export function useTransaction() {
  const syncDoc = useSyncDoc();
  return useCallback((callback: () => void) => syncDoc.doc.transact(callback), [syncDoc]);
}

export function useSyncEvent<T extends SyncEvent>(eventType: EventConstructor<T>, callback: (event: T) => void): void {
  const syncDoc = useSyncDoc();
  useEffect(() => syncDoc.on(eventType, callback), [syncDoc, eventType, callback]);
}
