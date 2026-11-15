import { BoardView } from "@tomato/constants";
import type { PaginatedResponse } from "@/shared/types/api.types";
import type { Board, BoardColumn, BoardSummary, BoardTaskSettingInput } from "../board.types";
import { apiClient } from "@/shared/lib/api-client";
import { BOARD_LIST_PAGE_SIZE } from "../board.constants";
import type { CreateBoardInput, UpdateBoardInput } from "../board.schemas";

const BOARDS_URL = "/boards";

export function getBoardViewUrl(id: string, view: BoardView): string {
  return `${BOARDS_URL}/${id}/${view}-views`;
}

export async function listBoards(): Promise<PaginatedResponse<BoardSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<BoardSummary>>(BOARDS_URL, {
    params: { pageSize: BOARD_LIST_PAGE_SIZE },
  });
  return data;
}

export async function getBoard(id: string): Promise<Board> {
  const { data } = await apiClient.get<Board>(`${BOARDS_URL}/${id}`);
  return data;
}

export async function createBoard(input: CreateBoardInput): Promise<Board> {
  const { data } = await apiClient.post<Board>(BOARDS_URL, input);
  return data;
}

export async function updateBoard(id: string, input: UpdateBoardInput): Promise<Board> {
  const { data } = await apiClient.patch<Board>(`${BOARDS_URL}/${id}`, input);
  return data;
}

export async function saveBoardTable(id: string, columns: BoardColumn[]): Promise<Board> {
  const { data } = await apiClient.put<Board>(getBoardViewUrl(id, BoardView.TABLE), { columns });
  return data;
}

export async function saveBoardTask(id: string, settings: BoardTaskSettingInput[]): Promise<Board> {
  const { data } = await apiClient.put<Board>(getBoardViewUrl(id, BoardView.TASK), { settings });
  return data;
}

export async function addBoardView(id: string, view: BoardView): Promise<Board> {
  if (view === BoardView.TABLE) return saveBoardTable(id, []);
  const { data } = await apiClient.put<Board>(getBoardViewUrl(id, view));
  return data;
}

export async function removeBoardView(id: string, view: BoardView): Promise<void> {
  await apiClient.delete(getBoardViewUrl(id, view));
}

export async function deleteBoard(id: string): Promise<void> {
  await apiClient.delete(`${BOARDS_URL}/${id}`);
}
