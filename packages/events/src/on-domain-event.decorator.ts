import { OnEvent } from '@nestjs/event-emitter';
import type { DomainEvent, DomainEventType } from './domain-event';

export const OnDomainEvent = <T extends DomainEvent>(eventType: DomainEventType<T>): MethodDecorator =>
  OnEvent(eventType.name);
