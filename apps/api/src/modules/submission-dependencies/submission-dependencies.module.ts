import { Module } from '@nestjs/common';
import { SubmissionDependenciesRepository } from './submission-dependencies.repository';
import { SubmissionDependenciesService } from './submission-dependencies.service';

@Module({
  providers: [SubmissionDependenciesService, SubmissionDependenciesRepository],
  exports: [SubmissionDependenciesService],
})
export class SubmissionDependenciesModule {}
