import { RealtimeRoom } from '@tomato/constants';
import { describe, expect, it } from 'vitest';
import { buildRealtimeRoom } from './realtime-room';

describe('buildRealtimeRoom', () => {
  it('joins the kind and the id', () => {
    expect(buildRealtimeRoom(RealtimeRoom.SUBMISSION, 'abc')).toBe('submission:abc');
  });
});
