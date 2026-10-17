export const Theme = {
  TWILIGHT: 'twilight',
  RASPBERRY: 'raspberry',
  OCHRE: 'ochre',
  GREEN: 'green',
  SEAGREEN: 'seagreen',
  SHADOW: 'shadow',
  CRAYOLA: 'crayola',
  NAVY: 'navy',
  TOMATO: 'tomato',
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

export const DEFAULT_THEME: Theme = Theme.TOMATO;
