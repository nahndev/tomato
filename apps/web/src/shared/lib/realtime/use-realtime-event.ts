"use client";

import type { RealtimeEvent } from "@tomato/constants";
import { useEffect, useEffectEvent } from "react";
import { onRealtimeEvent } from "./realtime-client";

export function useRealtimeEvent<T>(event: RealtimeEvent, listener: (payload: T) => void): void {
  const handleEvent = useEffectEvent(listener);

  useEffect(() => onRealtimeEvent<T>(event, (payload) => handleEvent(payload)), [event]);
}
