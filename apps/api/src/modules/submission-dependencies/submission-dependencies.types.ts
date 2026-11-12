import type { SubmissionDependency } from '../../generated/prisma/client';
import type { SubmissionEntity } from '../submissions/submissions.types';

export type SubmissionDependencyEntity = Omit<SubmissionDependency, 'meta'> & { meta: Record<string, unknown> };

export interface SubmissionGraph {
  nodes: SubmissionEntity[];
  edges: SubmissionDependencyEntity[];
}
