import { RealtimeRoom } from '@tomato/constants';
import { describe, expect, it } from 'vitest';
import { RealtimeRoomName } from './realtime-room-name';

describe('RealtimeRoomName', () => {
  it('round-trips the kind and the id', () => {
    expect(RealtimeRoomName.format({ kind: RealtimeRoom.SUBMISSION, id: 'abc' })).toBe('submission:abc');
    expect(RealtimeRoomName.parse('template:abc')).toEqual({ kind: RealtimeRoom.TEMPLATE, id: 'abc' });
  });

  it.each(['', 'submission', 'submission:', 'board:abc', 'submission:abc:extra'])('rejects %j', (name) => {
    expect(RealtimeRoomName.parse(name)).toBeNull();
  });
});
