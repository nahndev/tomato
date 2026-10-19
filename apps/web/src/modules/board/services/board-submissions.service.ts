import type { PaginatedResponse, Submission } from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";
import { SUBMISSION_LIST_PAGE_SIZE } from "../board.constants";

const SUBMISSIONS_URL = "/submissions";

export async function listBoardSubmissions(boardId: string): Promise<PaginatedResponse<Submission>> {
  const { data } = await apiClient.get<PaginatedResponse<Submission>>(SUBMISSIONS_URL, {
    params: { boardId, pageSize: SUBMISSION_LIST_PAGE_SIZE },
  });
  return data;
}

export async function createSubmission(boardId: string, templateId: string): Promise<Submission> {
  const { data } = await apiClient.post<Submission>(SUBMISSIONS_URL, { boardId, templateId });
  return data;
}

export async function deleteSubmission(id: string): Promise<void> {
  await apiClient.delete(`${SUBMISSIONS_URL}/${id}`);
}
