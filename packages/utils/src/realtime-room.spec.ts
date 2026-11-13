import { RealtimeRoom } from '@tomato/constants';
import { describe, expect, it } from 'vitest';
import { toRealtimeRoom } from './realtime-room';

describe('toRealtimeRoom', () => {
  it('joins the kind and the id', () => {
    expect(toRealtimeRoom(RealtimeRoom.SUBMISSION, 'abc')).toBe('submission:abc');
  });
});
