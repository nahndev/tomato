export const TemplateTab = {
  ALL: "all",
  CLOSED: "closed",
} as const;
export type TemplateTab = (typeof TemplateTab)[keyof typeof TemplateTab];

export const TEMPLATE_TAB_LABELS: Record<TemplateTab, string> = {
  [TemplateTab.ALL]: "All",
  [TemplateTab.CLOSED]: "Closed",
};
