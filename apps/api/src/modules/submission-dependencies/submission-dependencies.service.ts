import { Injectable, NotFoundException } from '@nestjs/common';
import { SubmissionDependenciesRepository } from './submission-dependencies.repository';
import type { ReferTarget, SubmissionGraph } from './submission-dependencies.types';

@Injectable()
export class SubmissionDependenciesService {
  constructor(private readonly repository: SubmissionDependenciesRepository) {}

  async getGraph(submissionId: string): Promise<SubmissionGraph> {
    const graph = await this.repository.findGraph(submissionId);
    if (!graph.nodes.length) throw new NotFoundException();
    return graph;
  }

  deleteReferencedExcept(sourceId: string, refer: string, idempotencyKeys: string[]): Promise<void> {
    return this.repository.deleteReferencedExcept(sourceId, refer, idempotencyKeys);
  }

  createReferDependencies(sourceId: string, refer: string, idempotencyKeys: string[], target: ReferTarget): Promise<void> {
    return this.repository.createReferDependencies(sourceId, refer, idempotencyKeys, target);
  }
}
