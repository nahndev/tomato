"use client";

import { DEFAULT_THEME, Theme } from "@tomato/constants";
import { useCallback, useSyncExternalStore } from "react";
import { THEME_COOKIE, THEME_COOKIE_MAX_AGE } from "../theme.constants";
import { resolveTheme } from "../theme.utils";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function useTheme(initialTheme: Theme = DEFAULT_THEME) {
  const theme = useSyncExternalStore(
    subscribe,
    () => resolveTheme(document.documentElement.dataset.theme),
    () => initialTheme,
  );

  const setTheme = useCallback((value: string) => {
    const next = resolveTheme(value);
    document.documentElement.dataset.theme = next;
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  }, []);

  return { theme, setTheme };
}
