export const mapKeys = {
  list: ["maps", "list"] as const,
  detail: (id: string) => ["maps", "detail", id] as const,
};
