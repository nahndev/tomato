import { RealtimeEvent } from '@tomato/constants';
import { describe, expect, it, vi } from 'vitest';
import type { RealtimeService } from '../realtime/realtime.service';
import { SubmissionDependenciesRealtimeListener } from './submission-dependencies-realtime.listener';
import { SubmissionDependenciesChangedEvent } from './submission-dependencies.events';

const SUBMISSION_ID = '0b6f5c1e-2d3a-4e7f-9a8b-1c2d3e4f5a60';

describe('SubmissionDependenciesRealtimeListener', () => {
  it('tells the source submission its graph changed', () => {
    const emit = vi.fn();
    const listener = new SubmissionDependenciesRealtimeListener({ emit } as unknown as RealtimeService);

    listener.onChanged(new SubmissionDependenciesChangedEvent(SUBMISSION_ID));

    expect(emit).toHaveBeenCalledWith(`submission:${SUBMISSION_ID}`, RealtimeEvent.SUBMISSION_GRAPH_CHANGED, {
      id: SUBMISSION_ID,
    });
  });
});
