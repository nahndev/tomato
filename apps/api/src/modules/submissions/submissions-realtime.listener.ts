import { Injectable } from '@nestjs/common';
import { RealtimeEvent, RealtimeRoom } from '@tomato/constants';
import { toRealtimeRoom } from '@tomato/utils';
import { OnDomainEvent } from '@tomato/events';
import { RealtimeService } from '../realtime/realtime.service';
import { SubmissionRemovedEvent, SubmissionUpdatedEvent } from './submissions.events';
import type { SubmissionGraphChangedPayload } from '../submission-dependencies/submission-dependencies.types';
import type { SubmissionSummaryPayload } from './submissions.types';

@Injectable()
export class SubmissionsRealtimeListener {
  constructor(private readonly realtime: RealtimeService) {}

  @OnDomainEvent(SubmissionUpdatedEvent)
  onUpdated({ submission }: SubmissionUpdatedEvent): void {
    const { id, boardId, title, updatedAt } = submission;
    this.realtime.emit(toRealtimeRoom(RealtimeRoom.BOARD, boardId), RealtimeEvent.SUBMISSION_VALUES, submission);
    this.realtime.emit(
      toRealtimeRoom(RealtimeRoom.SUBMISSION, id),
      RealtimeEvent.SUBMISSION_SUMMARY,
      { id, title, updatedAt } satisfies SubmissionSummaryPayload,
    );
  }

  @OnDomainEvent(SubmissionRemovedEvent)
  onRemoved({ id }: SubmissionRemovedEvent): void {
    this.realtime.emit(
      toRealtimeRoom(RealtimeRoom.SUBMISSION, id),
      RealtimeEvent.SUBMISSION_GRAPH_CHANGED,
      { id } satisfies SubmissionGraphChangedPayload,
    );
  }
}
