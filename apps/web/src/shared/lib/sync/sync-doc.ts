import * as Y from "yjs";
import { getSubscriptions, isSyncHandler } from "./sync.decorators";
import type { EventConstructor, SyncEvent } from "./sync-event";
import { isOnDestroy, isOnSynced } from "./sync.types";

type HandlerConstructor<T extends object> = new (...args: never[]) => T;

export class SyncDoc {
  readonly doc = new Y.Doc();
  private readonly listeners = new Map<EventConstructor, Set<(event: SyncEvent) => void>>();
  private readonly instances = new Map<object, object>();
  private readonly unregisterFns: Array<() => void> = [];

  on<T extends SyncEvent>(eventType: EventConstructor<T>, listener: (event: T) => void): () => void {
    const set = this.listeners.get(eventType) ?? new Set();
    set.add(listener as (event: SyncEvent) => void);
    this.listeners.set(eventType, set);
    return () => set.delete(listener as (event: SyncEvent) => void);
  }

  emit(event: SyncEvent): void {
    this.listeners.get(event.constructor as EventConstructor)?.forEach((listener) => listener(event));
  }

  registerHandler<T extends object>(handler: T): T {
    const name = handler.constructor.name;
    if (!isSyncHandler(handler.constructor)) {
      throw new Error(`${name} is missing @SyncHandler()`);
    }
    if (this.instances.has(handler.constructor)) {
      throw new Error(`${name} is already registered`);
    }
    this.instances.set(handler.constructor, handler);

    getSubscriptions(handler).forEach(({ eventType, methodName }) => {
      const off = this.on(eventType, (event) => {
        try {
          (handler as Record<string | symbol, (e: SyncEvent) => void>)[methodName](event);
        } catch (error) {
          console.error(`[${name}] failed to handle ${eventType.name}`, error);
        }
      });
      this.unregisterFns.push(off);
    });

    return handler;
  }

  getHandler<T extends object>(ctor: HandlerConstructor<T>): T {
    const found = this.instances.get(ctor);
    if (!found) throw new Error(`${ctor.name} is not registered`);
    return found as T;
  }

  synced(): void {
    this.instances.forEach((handler) => {
      if (isOnSynced(handler)) handler.onSynced();
    });
  }

  destroy(): void {
    this.instances.forEach((handler) => {
      if (isOnDestroy(handler)) handler.onDestroy();
    });
    this.unregisterFns.forEach((fn) => fn());
    this.doc.destroy();
  }
}
