import { NotFoundException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import type { SubmissionDependenciesRepository } from './submission-dependencies.repository';
import { SubmissionDependenciesService } from './submission-dependencies.service';
import type { SubmissionGraph } from './submission-dependencies.types';

const SUBMISSION_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';

function createService(graphs: Record<string, SubmissionGraph>) {
  const repository = {
    async findGraph(submissionId: string) {
      return graphs[submissionId] ?? { nodes: [], edges: [] };
    },
  };
  return new SubmissionDependenciesService(repository as unknown as SubmissionDependenciesRepository);
}

describe('SubmissionDependenciesService', () => {
  it('returns the graph of a submission', async () => {
    const graph = { nodes: [{ id: SUBMISSION_ID }], edges: [] };

    expect(await createService({ [SUBMISSION_ID]: graph }).getGraph(SUBMISSION_ID)).toBe(graph);
  });

  it('throws NotFound for an unknown submission', async () => {
    await expect(createService({}).getGraph(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
  });
});
