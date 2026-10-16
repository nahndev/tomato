export const TemplateView = {
  GRID: "grid",
  LIST: "list",
} as const;
export type TemplateView = (typeof TemplateView)[keyof typeof TemplateView];

export const TEMPLATE_LIST_COLUMNS =
  "grid-cols-[minmax(0,1fr)_2rem] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_6rem_2rem]";

export const getTemplatePath = (id: string) => `/templates/${id}`;
