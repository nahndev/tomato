import { REALTIME_ROOM_SEPARATOR, type RealtimeRoom } from '@tomato/constants';

export function toRealtimeRoom(kind: RealtimeRoom, id: string): string {
  return [kind, id].join(REALTIME_ROOM_SEPARATOR);
}
