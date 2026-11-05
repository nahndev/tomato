export const userKeys = {
  all: (departmentId: string) => ["departments", departmentId, "users"] as const,
  detail: (departmentId: string, id: string) => ["departments", departmentId, "users", id] as const,
};
