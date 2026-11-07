export const roleKeys = {
  all: (departmentId: string) =>
    ["departments", departmentId, "roles"] as const,
  detail: (departmentId: string, id: string) =>
    ["departments", departmentId, "roles", id] as const,
};
