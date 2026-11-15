import { BoardView } from "@tomato/constants";
import type { PaginatedResponse } from "@/shared/types/api.types";
import type { Board, BoardColumn, BoardSummary, BoardTaskSettingInput } from "../board.types";
import { apiClient } from "@/shared/lib/api-client";
import { BOARD_LIST_PAGE_SIZE } from "../board.constants";
import type { CreateBoardInput, UpdateBoardInput } from "../board.schemas";

const BOARDS_URL = "/boards";

export function getBoardViewUrl(id: string, view: BoardView): string {
  return `${BOARDS_URL}/${id}/views/${view}`;
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

export async function saveBoardTable(id: string, setting: BoardColumn[]): Promise<Board> {
  const { data } = await apiClient.put<Board>(getBoardViewUrl(id, BoardView.TABLE), { setting });
  return data;
}

export async function saveBoardTask(id: string, setting: BoardTaskSettingInput[]): Promise<Board> {
  const { data } = await apiClient.put<Board>(getBoardViewUrl(id, BoardView.TASK), { setting });
  return data;
}

export async function deleteBoard(id: string): Promise<void> {
  await apiClient.delete(`${BOARDS_URL}/${id}`);
}
