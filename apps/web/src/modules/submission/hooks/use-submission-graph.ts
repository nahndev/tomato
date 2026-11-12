"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSubmissionGraph } from "../services/submission.service";
import { submissionKeys } from "../submission.keys";

export function useSubmissionGraph(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: submissionKeys.graph(id),
    queryFn: async () => {
      const graph = await getSubmissionGraph(id);
      // Every node shares the same connected component, so its graph is this one.
      for (const node of graph.nodes) {
        if (node.id !== id) queryClient.setQueryData(submissionKeys.graph(node.id), graph);
      }
      return graph;
    },
  });
}
