import { Injectable, NotFoundException } from '@nestjs/common';
import { EventBusService } from '@tomato/events';
import { SubmissionDependenciesChangedEvent } from './submission-dependencies.events';
import { SubmissionDependenciesRepository } from './submission-dependencies.repository';
import type { ReferTarget, SubmissionGraph } from './submission-dependencies.types';

@Injectable()
export class SubmissionDependenciesService {
  constructor(
    private readonly repository: SubmissionDependenciesRepository,
    private readonly events: EventBusService,
  ) {}

  async getGraph(submissionId: string): Promise<SubmissionGraph> {
    const graph = await this.repository.findGraph(submissionId);
    if (!graph.nodes.length) throw new NotFoundException();
    return graph;
  }

  async deleteReferencedExcept(sourceId: string, refer: string, idempotencyKeys: string[]): Promise<void> {
    const deleted = await this.repository.deleteReferencedExcept(sourceId, refer, idempotencyKeys);
    if (deleted) this.events.emit(new SubmissionDependenciesChangedEvent(sourceId));
  }

  async createReferDependencies(
    sourceId: string,
    refer: string,
    idempotencyKeys: string[],
    target: ReferTarget,
  ): Promise<void> {
    const created = await this.repository.createReferDependencies(sourceId, refer, idempotencyKeys, target);
    if (created) this.events.emit(new SubmissionDependenciesChangedEvent(sourceId));
  }
}
