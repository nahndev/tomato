import type { BoardView } from "@tomato/constants";
import type { BoardAgendaRange } from "./board.types";

export const boardKeys = {
  all: ["boards"] as const,
  menu: () => [...boardKeys.all, "menu"] as const,
  detail: (id: string) => ["boards", id] as const,
  submissions: (boardId: string) => ["boards", boardId, "submissions"] as const,
  viewSubmissions: (
    boardId: string,
    templateIds: string[],
    view: BoardView | undefined,
    range: BoardAgendaRange | undefined,
  ) => [...boardKeys.submissions(boardId), templateIds, view, range] as const,
};
