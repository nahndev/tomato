export const submissionDependencyKeys = {
  graph: (submissionId: string) => ["submissions", submissionId, "graph"] as const,
};
