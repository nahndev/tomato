export const boardKeys = {
  all: ["boards"] as const,
  menu: () => [...boardKeys.all, "menu"] as const,
  detail: (id: string) => ["boards", id] as const,
  submissions: (boardId: string, templateIds: string[]) => ["boards", boardId, "submissions", templateIds] as const,
};
