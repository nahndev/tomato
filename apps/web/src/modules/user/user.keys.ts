export const userKeys = {
  all: (departmentId: string) => ["departments", departmentId, "users"] as const,
  byRole: (departmentId: string) => ["departments", departmentId, "users", "by-role"] as const,
  list: (departmentId: string, roleId?: string) =>
    roleId ? ([...userKeys.byRole(departmentId), roleId] as const) : userKeys.all(departmentId),
  detail: (departmentId: string, id: string) => ["departments", departmentId, "users", id] as const,
};
