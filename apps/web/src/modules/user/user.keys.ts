export const userKeys = {
  all: (departmentId: string) => ["departments", departmentId, "users"] as const,
};
