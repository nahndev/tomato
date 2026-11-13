import { NotFoundException } from '@nestjs/common';
import type { EventBusService } from '@tomato/events';
import { describe, expect, it, vi } from 'vitest';
import { SubmissionDependenciesChangedEvent } from './submission-dependencies.events';
import type { SubmissionDependenciesRepository } from './submission-dependencies.repository';
import { SubmissionDependenciesService } from './submission-dependencies.service';
import type { SubmissionGraph } from './submission-dependencies.types';

const SUBMISSION_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';

function createService(graphs: Record<string, SubmissionGraph>, changes = 0, emit = vi.fn()) {
  const repository = {
    async findGraph(submissionId: string) {
      return graphs[submissionId] ?? { nodes: [], edges: [] };
    },
    async deleteReferencedExcept() {
      return changes;
    },
    async createReferDependencies() {
      return changes;
    },
  };
  return new SubmissionDependenciesService(
    repository as unknown as SubmissionDependenciesRepository,
    { emit } as unknown as EventBusService,
  );
}

const TARGET = { boardId: MISSING_ID, templateVersionId: MISSING_ID };

describe('SubmissionDependenciesService', () => {
  it('returns the graph of a submission', async () => {
    const graph = { nodes: [{ id: SUBMISSION_ID, title: '' }], edges: [] };

    expect(await createService({ [SUBMISSION_ID]: graph }).getGraph(SUBMISSION_ID)).toBe(graph);
  });

  it('throws NotFound for an unknown submission', async () => {
    await expect(createService({}).getGraph(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('emits a change of the source when dependencies are deleted or created', async () => {
    const emit = vi.fn();
    const service = createService({}, 1, emit);

    await service.deleteReferencedExcept(SUBMISSION_ID, 'refer', []);
    await service.createReferDependencies(SUBMISSION_ID, 'refer', ['key'], TARGET);

    const event = new SubmissionDependenciesChangedEvent(SUBMISSION_ID);
    expect(emit.mock.calls).toEqual([[event], [event]]);
  });

  it('emits nothing when no dependency changed', async () => {
    const emit = vi.fn();
    const service = createService({}, 0, emit);

    await service.deleteReferencedExcept(SUBMISSION_ID, 'refer', ['key']);
    await service.createReferDependencies(SUBMISSION_ID, 'refer', ['key'], TARGET);

    expect(emit).not.toHaveBeenCalled();
  });
});
