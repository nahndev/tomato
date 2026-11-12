import { describe, expect, it } from 'vitest';
import { SUBMISSION_GRAPH_MAX_DEPTH } from './submission-dependencies.constants';
import type { SubmissionDependenciesRepository } from './submission-dependencies.repository';
import { SubmissionDependenciesService } from './submission-dependencies.service';

const SUBMISSION_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';

describe('SubmissionDependenciesService', () => {
  it('reads the graph capped at the max depth', async () => {
    const calls: [string, number][] = [];
    const graph = { nodes: [], edges: [] };
    const repository = {
      async findGraph(submissionId: string, maxDepth: number) {
        calls.push([submissionId, maxDepth]);
        return graph;
      },
    };
    const service = new SubmissionDependenciesService(repository as unknown as SubmissionDependenciesRepository);

    expect(await service.getGraph(SUBMISSION_ID)).toBe(graph);
    expect(calls).toEqual([[SUBMISSION_ID, SUBMISSION_GRAPH_MAX_DEPTH]]);
  });
});
