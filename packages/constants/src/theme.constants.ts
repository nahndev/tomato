export const Theme = {
  TWILIGHT: 'twilight',
  AMARANTH: 'amaranth',
  RASPBERRY: 'raspberry',
  STEEL: 'steel',
  POWDER: 'powder',
  OCHRE: 'ochre',
  GREEN: 'green',
  SEAGREEN: 'seagreen',
  SHADOW: 'shadow',
  CRAYOLA: 'crayola',
  RUSTY_SPICE: 'rusty-spice',
  ROSE_KISS: 'rose-kiss',
  NAVY: 'navy',
  SLATE: 'slate',
  CORAL: 'coral',
  TOMATO: 'tomato',
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

export const DEFAULT_THEME: Theme = Theme.TOMATO;
