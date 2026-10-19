import type { Board, BoardSummary, PaginatedResponse } from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";
import { BOARD_LIST_PAGE_SIZE } from "../board.constants";
import type { CreateBoardInput, UpdateBoardInput } from "../board.schemas";

const BOARDS_URL = "/boards";

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

export async function deleteBoard(id: string): Promise<void> {
  await apiClient.delete(`${BOARDS_URL}/${id}`);
}
