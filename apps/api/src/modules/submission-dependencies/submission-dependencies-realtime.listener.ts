import { Injectable } from '@nestjs/common';
import { RealtimeEvent, RealtimeRoom } from '@tomato/constants';
import { RealtimeRoomName } from '@tomato/protocol';
import { OnDomainEvent } from '@tomato/events';
import { RealtimeService } from '../realtime/realtime.service';
import { SubmissionDependenciesChangedEvent } from './submission-dependencies.events';
import type { SubmissionGraphChangedPayload } from './submission-dependencies.types';

@Injectable()
export class SubmissionDependenciesRealtimeListener {
  constructor(private readonly realtime: RealtimeService) {}

  @OnDomainEvent(SubmissionDependenciesChangedEvent)
  onChanged({ sourceId }: SubmissionDependenciesChangedEvent): void {
    this.realtime.emit(
      RealtimeRoomName.format({ kind: RealtimeRoom.SUBMISSION, id: sourceId }),
      RealtimeEvent.SUBMISSION_GRAPH_CHANGED,
      { id: sourceId } satisfies SubmissionGraphChangedPayload,
    );
  }
}
