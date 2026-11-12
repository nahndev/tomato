import type { SubmissionDependency } from '../../generated/prisma/client';

export type SubmissionDependencyEntity = Omit<SubmissionDependency, 'meta'> & { meta: Record<string, unknown> };

export interface SubmissionGraphNode {
  id: string;
}

export interface SubmissionGraph {
  nodes: SubmissionGraphNode[];
  edges: SubmissionDependencyEntity[];
}
