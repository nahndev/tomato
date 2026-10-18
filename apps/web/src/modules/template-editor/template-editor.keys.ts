export const templateEditorKeys = {
  template: (id: string) => ["templates", id] as const,
  versions: (id: string) => ["templates", id, "versions"] as const,
};
