import type { SubmissionDependencyType } from "@tomato/constants";

export interface SubmissionDependency {
  id: string;
  sourceId: string;
  targetId: string;
  type: SubmissionDependencyType;
  refer: string | null;
  idempotencyKey: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionGraphNode {
  id: string;
  title: string;
}

export interface SubmissionGraph {
  nodes: SubmissionGraphNode[];
  edges: SubmissionDependency[];
}

export interface DependencyGraphValue {
  /** The submission whose dependencies the hooks read. */
  sourceId: string;
  graph: SubmissionGraph | undefined;
  /** Asks for the graph to be polled until the returned function is called. */
  requestPolling: () => () => void;
}
