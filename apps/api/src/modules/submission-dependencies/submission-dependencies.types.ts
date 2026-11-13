import type { SubmissionDependency } from '../../generated/prisma/client';

export type SubmissionDependencyEntity = Omit<SubmissionDependency, 'meta'> & { meta: Record<string, unknown> };

export interface ReferTarget {
  boardId: string;
  templateVersionId: string;
}

export interface SubmissionGraphNode {
  id: string;
  title: string;
}

export interface SubmissionGraph {
  nodes: SubmissionGraphNode[];
  edges: SubmissionDependencyEntity[];
}
