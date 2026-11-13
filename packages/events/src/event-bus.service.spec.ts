import { EVENT_LISTENER_METADATA, EventEmitter2 } from '@nestjs/event-emitter';
import { describe, expect, it, vi } from 'vitest';
import { DomainEvent } from './domain-event';
import { EventBusService } from './event-bus.service';
import { OnDomainEvent } from './on-domain-event.decorator';

class SampleCreatedEvent extends DomainEvent {
  constructor(readonly id: string) {
    super();
  }
}

class SampleListener {
  @OnDomainEvent(SampleCreatedEvent)
  onCreated(): void {}
}

describe('EventBusService', () => {
  it('emits an event under its class name', () => {
    const emitter = new EventEmitter2();
    const listener = vi.fn();
    emitter.on(SampleCreatedEvent.name, listener);
    const event = new SampleCreatedEvent('a');

    new EventBusService(emitter).emit(event);

    expect(listener).toHaveBeenCalledWith(event);
  });

  it('subscribes a listener method to the class name', () => {
    const metadata: unknown = Reflect.getMetadata(EVENT_LISTENER_METADATA, SampleListener.prototype.onCreated);

    expect(metadata).toEqual([{ event: 'SampleCreatedEvent', options: undefined }]);
  });
});
