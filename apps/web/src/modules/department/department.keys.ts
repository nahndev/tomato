export const departmentKeys = {
  all: ["departments"] as const,
  menu: () => [...departmentKeys.all, "menu"] as const,
  detail: (id: string) => ["departments", id] as const,
};
