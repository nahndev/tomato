import type { SubmissionDetail } from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";

export async function getSubmission(id: string): Promise<SubmissionDetail> {
  const { data } = await apiClient.get<SubmissionDetail>(`/submissions/${id}`);
  return data;
}
