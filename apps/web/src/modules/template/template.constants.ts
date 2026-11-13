export const TemplateLayout = {
  GRID: "grid",
  LIST: "list",
} as const;
export type TemplateLayout = (typeof TemplateLayout)[keyof typeof TemplateLayout];

export const ALL_CATEGORY_ID = "all";
