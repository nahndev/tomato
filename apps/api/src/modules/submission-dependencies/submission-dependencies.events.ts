import { DomainEvent } from '@tomato/events';

export class SubmissionDependenciesChangedEvent extends DomainEvent {
  constructor(readonly sourceId: string) {
    super();
  }
}
