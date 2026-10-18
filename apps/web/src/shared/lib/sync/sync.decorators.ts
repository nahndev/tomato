import type { EventConstructor, SyncEvent } from "./sync-event";

const SUBSCRIPTIONS = Symbol("sync:subscriptions");
const HANDLER = Symbol("sync:handler");

export interface EventSubscription {
  eventType: EventConstructor;
  methodName: string | symbol;
}

type Decorated = { [SUBSCRIPTIONS]?: EventSubscription[]; [HANDLER]?: true };

export function OnSyncEvent<T extends SyncEvent>(eventType: EventConstructor<T>) {
  return function (target: object, methodName: string | symbol) {
    const ctor = target.constructor as Decorated;
    const own = Object.hasOwn(ctor, SUBSCRIPTIONS) ? ctor[SUBSCRIPTIONS]! : [...(ctor[SUBSCRIPTIONS] ?? [])];
    ctor[SUBSCRIPTIONS] = [...own, { eventType, methodName }];
  };
}

export function SyncHandler(): ClassDecorator {
  return function (target) {
    (target as unknown as Decorated)[HANDLER] = true;
  };
}

export function isSyncHandler(ctor: object): boolean {
  return (ctor as Decorated)[HANDLER] === true;
}

export function getSubscriptions(handler: object): EventSubscription[] {
  return (handler.constructor as Decorated)[SUBSCRIPTIONS] ?? [];
}
