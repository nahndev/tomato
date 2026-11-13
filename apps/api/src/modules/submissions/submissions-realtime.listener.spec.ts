import { RealtimeEvent } from '@tomato/constants';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RealtimeService } from '../realtime/realtime.service';
import { SubmissionsRealtimeListener } from './submissions-realtime.listener';
import { SubmissionRemovedEvent, SubmissionUpdatedEvent } from './submissions.events';
import type { UpdatedSubmissionEntity } from './submissions.types';

const SUBMISSION_ID = '0b6f5c1e-2d3a-4e7f-9a8b-1c2d3e4f5a60';
const BOARD_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const UPDATED_AT = new Date('2026-11-13T00:00:00Z');

const SUBMISSION: UpdatedSubmissionEntity = {
  id: SUBMISSION_ID,
  boardId: BOARD_ID,
  data: { name: 'Ada' },
  dataDisplays: {},
  title: 'Intake of Ada',
  updatedAt: UPDATED_AT,
};

describe('SubmissionsRealtimeListener', () => {
  let emit: ReturnType<typeof vi.fn>;
  let listener: SubmissionsRealtimeListener;

  beforeEach(() => {
    emit = vi.fn();
    listener = new SubmissionsRealtimeListener({ emit } as unknown as RealtimeService);
  });

  it('sends the full values to the board and the summary to the submission', () => {
    listener.onUpdated(new SubmissionUpdatedEvent(SUBMISSION));

    expect(emit.mock.calls).toEqual([
      [`board:${BOARD_ID}`, RealtimeEvent.SUBMISSION_VALUES, SUBMISSION],
      [
        `submission:${SUBMISSION_ID}`,
        RealtimeEvent.SUBMISSION_SUMMARY,
        { id: SUBMISSION_ID, title: 'Intake of Ada', updatedAt: UPDATED_AT },
      ],
    ]);
  });

  it('tells a removed submission its graph changed', () => {
    listener.onRemoved(new SubmissionRemovedEvent(SUBMISSION_ID));

    expect(emit).toHaveBeenCalledWith(`submission:${SUBMISSION_ID}`, RealtimeEvent.SUBMISSION_GRAPH_CHANGED, {
      id: SUBMISSION_ID,
    });
  });
});
