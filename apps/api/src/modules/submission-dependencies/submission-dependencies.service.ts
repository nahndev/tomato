import { Injectable } from '@nestjs/common';
import { SUBMISSION_GRAPH_MAX_DEPTH } from './submission-dependencies.constants';
import { SubmissionDependenciesRepository } from './submission-dependencies.repository';
import type { SubmissionGraph } from './submission-dependencies.types';

@Injectable()
export class SubmissionDependenciesService {
  constructor(private readonly repository: SubmissionDependenciesRepository) {}

  getGraph(submissionId: string): Promise<SubmissionGraph> {
    return this.repository.findGraph(submissionId, SUBMISSION_GRAPH_MAX_DEPTH);
  }
}
