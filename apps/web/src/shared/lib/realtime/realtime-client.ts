import { REALTIME_ROOMS_SEPARATOR, RealtimeEvent } from "@tomato/constants";
import { REALTIME_URL } from "./realtime.constants";

type Listener = (payload: unknown) => void;

const roomCounts = new Map<string, number>();
const listeners = new Map<RealtimeEvent, Set<Listener>>();
let sources: EventSource[] = [];
let isConnectScheduled = false;

function connect(): void {
  isConnectScheduled = false;
  if (!roomCounts.size) {
    for (const source of sources) source.close();
    sources = [];
    return;
  }

  const rooms = [...roomCounts.keys()].join(REALTIME_ROOMS_SEPARATOR);
  const next = new EventSource(`${REALTIME_URL}?${new URLSearchParams({ rooms })}`);
  for (const event of Object.values(RealtimeEvent)) {
    next.addEventListener(event, ({ data }: MessageEvent<string>) => {
      const payload: unknown = JSON.parse(data);
      listeners.get(event)?.forEach((listener) => listener(payload));
    });
  }
  // The streams overlap until the new one is open, so no event is missed while switching rooms.
  next.addEventListener(
    "open",
    () => {
      const index = sources.indexOf(next);
      if (index <= 0) return;
      for (const source of sources.slice(0, index)) source.close();
      sources = sources.slice(index);
    },
    { once: true },
  );
  sources.push(next);
}

function scheduleConnect(): void {
  if (isConnectScheduled) return;
  isConnectScheduled = true;
  queueMicrotask(connect);
}

export function joinRealtimeRooms(rooms: string[]): () => void {
  for (const room of rooms) {
    const count = roomCounts.get(room) ?? 0;
    roomCounts.set(room, count + 1);
    if (count === 0) scheduleConnect();
  }

  return () => {
    for (const room of rooms) {
      const count = (roomCounts.get(room) ?? 1) - 1;
      if (count > 0) {
        roomCounts.set(room, count);
      } else {
        roomCounts.delete(room);
        scheduleConnect();
      }
    }
  };
}

export function onRealtimeEvent<T>(event: RealtimeEvent, listener: (payload: T) => void): () => void {
  const eventListeners = listeners.get(event) ?? new Set<Listener>();
  listeners.set(event, eventListeners);
  const handle = listener as Listener;
  eventListeners.add(handle);
  return () => {
    eventListeners.delete(handle);
  };
}
