"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RealtimeEvent, RealtimeRoom } from "@tomato/constants";
import { toRealtimeRoom } from "@tomato/utils";
import { useMemo } from "react";
import { useRealtimeEvent, useRealtimeRooms } from "@/shared/lib/realtime";
import { getSubmissionGraph } from "../services/submission-dependency.service";
import { submissionDependencyKeys } from "../submission-dependency.keys";
import type { SubmissionGraph, SubmissionGraphChange, SubmissionSummary } from "../submission-dependency.types";

export function useSubmissionGraph(id: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: submissionDependencyKeys.graph(id),
    queryFn: async () => {
      const graph = await getSubmissionGraph(id);
      // Every node shares the same connected component, so its graph is this one.
      for (const node of graph.nodes) {
        if (node.id !== id) queryClient.setQueryData(submissionDependencyKeys.graph(node.id), graph);
      }
      return graph;
    },
  });

  const nodeIds = useMemo(() => query.data?.nodes.map((node) => node.id) ?? [id], [query.data, id]);
  useRealtimeRooms(useMemo(() => nodeIds.map((nodeId) => toRealtimeRoom(RealtimeRoom.SUBMISSION, nodeId)), [nodeIds]));

  useRealtimeEvent<SubmissionSummary>(RealtimeEvent.SUBMISSION_SUMMARY, ({ id: changedId, title }) => {
    if (!nodeIds.includes(changedId)) return;
    for (const nodeId of nodeIds) {
      queryClient.setQueryData<SubmissionGraph>(submissionDependencyKeys.graph(nodeId), (graph) =>
        graph?.nodes.some((node) => node.id === changedId && node.title !== title)
          ? { ...graph, nodes: graph.nodes.map((node) => (node.id === changedId ? { ...node, title } : node)) }
          : graph,
      );
    }
  });

  useRealtimeEvent<SubmissionGraphChange>(RealtimeEvent.SUBMISSION_GRAPH_CHANGED, ({ id: changedId }) => {
    if (!nodeIds.includes(changedId)) return;
    for (const nodeId of nodeIds) {
      // Several hooks read the same graph; one refetch is enough.
      void queryClient.invalidateQueries({ queryKey: submissionDependencyKeys.graph(nodeId) }, { cancelRefetch: false });
    }
  });

  return query;
}
