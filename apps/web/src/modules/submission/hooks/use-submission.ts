"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubmission } from "../services/submission.service";
import { submissionKeys } from "../submission.keys";

export function useSubmission(id: string) {
  return useQuery({
    queryKey: submissionKeys.detail(id),
    queryFn: () => getSubmission(id),
  });
}
