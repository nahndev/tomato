"use client";

import { useCallback, useEffect } from "react";
import { createStoreContext } from "@tomato/store-context";
import type { SyncDoc } from "./sync-doc";
import type { EventConstructor, SyncEvent } from "./sync-event";

const SyncDocStore = createStoreContext<{ syncDoc: SyncDoc }>("SyncDoc");

export const SyncDocProvider = SyncDocStore.Provider;

export function useSyncDoc(): SyncDoc {
  return SyncDocStore.useSelector((state) => state.syncDoc);
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
