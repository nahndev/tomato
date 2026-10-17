import { Theme } from "@tomato/constants";

export const THEME_COOKIE = "theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const THEME_LABELS: Record<Theme, string> = {
  [Theme.TWILIGHT]: "Twilight",
  [Theme.AMARANTH]: "Amaranth",
  [Theme.RASPBERRY]: "Raspberry",
  [Theme.STEEL]: "Steel",
  [Theme.POWDER]: "Powder",
  [Theme.OCHRE]: "Ochre",
  [Theme.GREEN]: "Green",
  [Theme.SEAGREEN]: "Sea Green",
  [Theme.SHADOW]: "Shadow",
  [Theme.CRAYOLA]: "Crayola",
  [Theme.RUSTY_SPICE]: "Rusty Spice",
  [Theme.ROSE_KISS]: "Rose Kiss",
  [Theme.NAVY]: "Navy",
  [Theme.SLATE]: "Slate",
  [Theme.CORAL]: "Coral",
  [Theme.TOMATO]: "Tomato",
};
