export const mapKeys = {
  all: (departmentId: string) =>
    ["departments", departmentId, "maps"] as const,
  detail: (id: string) => ["maps", id] as const,
};
