import { SUBMISSION_TEMPLATE_IDS_SEPARATOR } from "@tomato/constants";
import type { PaginatedResponse } from "@/shared/types/api.types";
import type { Submission } from "../board.types";
import { apiClient } from "@/shared/lib/api-client";
import { SUBMISSION_LIST_PAGE_SIZE } from "../board.constants";

const SUBMISSIONS_URL = "/submissions";

export async function listSubmissions(templateIds: string[]): Promise<PaginatedResponse<Submission>> {
  const { data } = await apiClient.get<PaginatedResponse<Submission>>(SUBMISSIONS_URL, {
    params: { templateIds: templateIds.join(SUBMISSION_TEMPLATE_IDS_SEPARATOR), pageSize: SUBMISSION_LIST_PAGE_SIZE },
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
