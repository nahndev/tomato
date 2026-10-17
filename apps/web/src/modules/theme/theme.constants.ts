import { Theme } from "@tomato/constants";

export const THEME_COOKIE = "theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const THEME_LABELS: Record<Theme, string> = {
  [Theme.TWILIGHT]: "Twilight",
  [Theme.RASPBERRY]: "Raspberry",
  [Theme.OCHRE]: "Ochre",
  [Theme.GREEN]: "Green",
  [Theme.SEAGREEN]: "Sea Green",
  [Theme.SHADOW]: "Shadow",
  [Theme.CRAYOLA]: "Crayola",
  [Theme.NAVY]: "Navy",
  [Theme.TOMATO]: "Tomato",
};
