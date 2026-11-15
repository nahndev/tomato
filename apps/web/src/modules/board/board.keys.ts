export const boardKeys = {
  all: ["boards"] as const,
  menu: () => [...boardKeys.all, "menu"] as const,
  detail: (id: string) => ["boards", id] as const,
  submissions: (boardId: string) => ["boards", boardId, "submissions"] as const,
};
