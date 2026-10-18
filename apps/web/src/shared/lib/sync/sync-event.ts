export abstract class SyncEvent {}

export type EventConstructor<T extends SyncEvent = SyncEvent> = new (...args: never[]) => T;
