export const UNITS_PATH = "/workspace/units";

export const UNIT_LIST_PAGE_SIZE = 100;

export const UnitTab = {
  UNITS: "units",
  TYPES: "types",
} as const;
export type UnitTab = (typeof UnitTab)[keyof typeof UnitTab];
