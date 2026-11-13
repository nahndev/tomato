"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSubmissionGraph } from "../services/submission-dependency.service";
import { submissionDependencyKeys } from "../submission-dependency.keys";

export function useSubmissionGraph(id: string, refetchInterval: number | false = false) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: submissionDependencyKeys.graph(id),
    queryFn: async () => {
      const graph = await getSubmissionGraph(id);
      // Every node shares the same connected component, so its graph is this one.
      for (const node of graph.nodes) {
        if (node.id !== id) queryClient.setQueryData(submissionDependencyKeys.graph(node.id), graph);
      }
      return graph;
    },
    refetchInterval,
  });
}
