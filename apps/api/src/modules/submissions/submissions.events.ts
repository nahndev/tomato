import { DomainEvent } from '@tomato/events';
import type { UpdatedSubmissionEntity } from './submissions.types';

export class SubmissionUpdatedEvent extends DomainEvent {
  constructor(readonly submission: UpdatedSubmissionEntity) {
    super();
  }
}

export class SubmissionRemovedEvent extends DomainEvent {
  constructor(readonly id: string) {
    super();
  }
}
