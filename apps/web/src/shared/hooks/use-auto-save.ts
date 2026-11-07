"use client";

import { useEffect, useRef, useState } from "react";

export const AutoSaveStatus = {
  IDLE: "idle",
  SAVING: "saving",
  SAVED: "saved",
  ERROR: "error",
} as const;
export type AutoSaveStatus = (typeof AutoSaveStatus)[keyof typeof AutoSaveStatus];

interface UseAutoSaveOptions<T> {
  // null while the value is invalid: nothing is saved.
  value: T | null;
  delay: number;
  save: (value: T) => Promise<void>;
  // A save flushed on unmount can no longer show its status.
  onErrorAfterUnmount: (error: unknown) => void;
}

export function useAutoSave<T>({ value, delay, save, onErrorAfterUnmount }: UseAutoSaveOptions<T>) {
  const [status, setStatus] = useState<AutoSaveStatus>(AutoSaveStatus.IDLE);
  const [error, setError] = useState<unknown>();

  const serialized = value === null ? null : JSON.stringify(value);
  const lastSaved = useRef(serialized);
  const pending = useRef<{ value: T; serialized: string } | null>(null);
  const isInFlight = useRef(false);
  const isUnmounted = useRef(false);
  const callbacks = useRef({ save, onErrorAfterUnmount });

  // One save at a time, so an older request can never land after a newer one.
  const flush = useRef(async () => {
    if (isInFlight.current) return;
    isInFlight.current = true;
    while (pending.current) {
      const next = pending.current;
      pending.current = null;
      try {
        await callbacks.current.save(next.value);
        lastSaved.current = next.serialized;
        if (!pending.current) setStatus(AutoSaveStatus.SAVED);
      } catch (saveError) {
        if (isUnmounted.current) callbacks.current.onErrorAfterUnmount(saveError);
        if (!pending.current) {
          setError(saveError);
          setStatus(AutoSaveStatus.ERROR);
        }
      }
    }
    isInFlight.current = false;
  });

  useEffect(() => {
    callbacks.current = { save, onErrorAfterUnmount };
  });

  useEffect(() => {
    if (serialized === null || value === null) {
      pending.current = null;
      return;
    }
    if (serialized === lastSaved.current && !isInFlight.current) {
      pending.current = null;
      setStatus((current) => (current === AutoSaveStatus.IDLE ? current : AutoSaveStatus.SAVED));
      return;
    }
    pending.current = { value, serialized };
    setStatus(AutoSaveStatus.SAVING);
    const timer = setTimeout(() => void flush.current(), delay);
    return () => clearTimeout(timer);
    // `value` is represented by `serialized`.
  }, [serialized, delay]);

  useEffect(() => {
    isUnmounted.current = false;
    return () => {
      isUnmounted.current = true;
      void flush.current();
    };
  }, []);

  return { status, error };
}
