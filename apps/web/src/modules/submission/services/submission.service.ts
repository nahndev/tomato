import { apiClient } from "@/shared/lib/api-client";
import type { SubmissionDetail, SubmissionGraph } from "../submission.types";

export async function getSubmission(id: string): Promise<SubmissionDetail> {
  const { data } = await apiClient.get<SubmissionDetail>(`/submissions/${id}`);
  return data;
}

export async function getSubmissionGraph(id: string): Promise<SubmissionGraph> {
  const { data } = await apiClient.get<SubmissionGraph>(`/submissions/${id}/graph`);
  return data;
}
