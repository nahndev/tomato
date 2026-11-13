// Listeners subscribe by class name, so every event class name must be unique within an app.
export abstract class DomainEvent {}

export type DomainEventType<T extends DomainEvent = DomainEvent> = new (...args: never[]) => T;
