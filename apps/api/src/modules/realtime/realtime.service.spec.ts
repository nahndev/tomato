import type { MessageEvent } from '@nestjs/common';
import { RealtimeEvent } from '@tomato/constants';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { REALTIME_HEARTBEAT_EVENT, REALTIME_HEARTBEAT_MS } from './realtime.constants';
import { RealtimeService } from './realtime.service';

describe('RealtimeService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('streams only the events of the joined rooms', () => {
    const service = new RealtimeService();
    const received: MessageEvent[] = [];
    const subscription = service.stream(['submission:a']).subscribe((event) => received.push(event));

    service.emit('submission:a', RealtimeEvent.SUBMISSION_SUMMARY, { id: 'a' });
    service.emit('submission:b', RealtimeEvent.SUBMISSION_SUMMARY, { id: 'b' });
    subscription.unsubscribe();
    service.emit('submission:a', RealtimeEvent.SUBMISSION_SUMMARY, { id: 'a' });

    expect(received).toEqual([{ type: RealtimeEvent.SUBMISSION_SUMMARY, data: { id: 'a' } }]);
  });

  it('sends a heartbeat while the stream is idle', () => {
    vi.useFakeTimers();
    const received: MessageEvent[] = [];
    const subscription = new RealtimeService().stream(['board:a']).subscribe((event) => received.push(event));

    vi.advanceTimersByTime(REALTIME_HEARTBEAT_MS);
    subscription.unsubscribe();

    expect(received).toEqual([{ type: REALTIME_HEARTBEAT_EVENT, data: '' }]);
  });
});
