import { DomainEvent } from '@tomato/events';

export class ImageUploadedEvent extends DomainEvent {
  constructor(readonly objectId: string) {
    super();
  }
}
