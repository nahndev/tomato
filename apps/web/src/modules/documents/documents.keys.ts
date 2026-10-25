export const documentKeys = {
  all: (departmentId: string) =>
    ["departments", departmentId, "documents"] as const,
};
