import { apiClient } from "@/shared/lib/api-client";
import type { SubmissionGraph } from "../submission-dependency.types";

export async function getSubmissionGraph(id: string): Promise<SubmissionGraph> {
  const { data } = await apiClient.get<SubmissionGraph>(`/submissions/${id}/graph`);
  return data;
}
