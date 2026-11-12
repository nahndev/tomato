export const submissionKeys = {
  detail: (id: string) => ["submissions", id] as const,
  graph: (id: string) => ["submissions", id, "graph"] as const,
};
