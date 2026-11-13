export const templateKeys = {
  all: ["templates"] as const,
  versions: (templateId: string) => ["templates", templateId, "versions"] as const,
  categories: ["template-categories"] as const,
};
