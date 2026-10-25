export const roleKeys = {
  all: (departmentId: string) =>
    ["departments", departmentId, "roles"] as const,
};
