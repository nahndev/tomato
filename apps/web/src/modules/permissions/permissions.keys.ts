export const permissionKeys = {
  all: (departmentId: string) =>
    ["departments", departmentId, "permissions"] as const,
};
