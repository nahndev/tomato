import { apiClient } from "@/shared/lib/api-client";
import type { SubmissionDetail } from "../submission.types";

export async function getSubmission(id: string): Promise<SubmissionDetail> {
  const { data } = await apiClient.get<SubmissionDetail>(`/submissions/${id}`);
  return data;
}
