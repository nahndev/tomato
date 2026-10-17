import { DEFAULT_THEME, Theme } from "@tomato/constants";

export function resolveTheme(value: string | undefined): Theme {
  return Object.values(Theme).find((theme) => theme === value) ?? DEFAULT_THEME;
}
