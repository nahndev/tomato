"use client";

import { useEffect } from "react";
import { joinRealtimeRooms } from "./realtime-client";

/** `rooms` must be memoized: a new array joins again. */
export function useRealtimeRooms(rooms: string[]): void {
  useEffect(() => joinRealtimeRooms(rooms), [rooms]);
}
