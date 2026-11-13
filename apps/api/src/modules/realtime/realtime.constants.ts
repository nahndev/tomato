import { REALTIME_ROOM_SEPARATOR, RealtimeRoom } from '@tomato/constants';

export const REALTIME_ROOM_PATTERN = new RegExp(
  `^(${Object.values(RealtimeRoom).join('|')})${REALTIME_ROOM_SEPARATOR}[0-9a-f-]{36}$`,
);

// Keeps idle streams open behind proxies that time them out (Next.js rewrites cut at 30 s).
export const REALTIME_HEARTBEAT_MS = 15_000;
export const REALTIME_HEARTBEAT_EVENT = 'ping';
