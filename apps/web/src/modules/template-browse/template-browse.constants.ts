export const TemplateView = {
  GRID: "grid",
  LIST: "list",
} as const;
export type TemplateView = (typeof TemplateView)[keyof typeof TemplateView];

export const getTemplatePath = (id: string) => `/templates/${id}`;

export const ALL_CATEGORY_ID = "all";
