import { BoardView } from "@tomato/constants";
import type { PaginatedResponse } from "@/shared/types/api.types";
import type { BoardAgendaRange, Submission, TaskChanges } from "../board.types";
import { apiClient } from "@/shared/lib/api-client";
import { SUBMISSION_LIST_PAGE_SIZE } from "../board.constants";
import { getBoardViewUrl } from "./boards.service";

const SUBMISSIONS_URL = "/submissions";

export async function listBoardViewSubmissions(
  boardId: string,
  view: BoardView,
  range?: BoardAgendaRange,
): Promise<PaginatedResponse<Submission>> {
  const { data } = await apiClient.get<PaginatedResponse<Submission>>(`${getBoardViewUrl(boardId, view)}/submissions`, {
    params: { pageSize: SUBMISSION_LIST_PAGE_SIZE, ...range },
  });
  return data;
}

export async function createSubmission(templateId: string): Promise<Submission> {
  const { data } = await apiClient.post<Submission>(SUBMISSIONS_URL, { templateId });
  return data;
}

export async function deleteSubmission(id: string): Promise<void> {
  await apiClient.delete(`${SUBMISSIONS_URL}/${id}`);
}

export async function updateTask(boardId: string, submissionId: string, changes: TaskChanges): Promise<void> {
  await apiClient.patch(`${getBoardViewUrl(boardId, BoardView.TASK)}/submissions/${submissionId}`, changes);
}
