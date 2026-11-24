import { REALTIME_ROOM_SEPARATOR, RealtimeRoom } from '@tomato/constants';

export interface RealtimeRoomNameParts {
  kind: RealtimeRoom;
  id: string;
}

const KINDS = new Set<string>(Object.values(RealtimeRoom));

export class RealtimeRoomName {
  static format({ kind, id }: RealtimeRoomNameParts): string {
    return [kind, id].join(REALTIME_ROOM_SEPARATOR);
  }

  static parse(name: string): RealtimeRoomNameParts | null {
    const [kind, id, ...rest] = name.split(REALTIME_ROOM_SEPARATOR);
    if (!KINDS.has(kind) || !id || rest.length > 0) return null;
    return { kind: kind as RealtimeRoom, id };
  }
}
