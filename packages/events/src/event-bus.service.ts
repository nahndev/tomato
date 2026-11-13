import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { DomainEvent } from './domain-event';

@Injectable()
export class EventBusService {
  // tsup emits no decorator metadata, so Nest cannot infer the type.
  constructor(@Inject(EventEmitter2) private readonly emitter: EventEmitter2) {}

  emit(event: DomainEvent): void {
    this.emitter.emit(event.constructor.name, event);
  }
}
