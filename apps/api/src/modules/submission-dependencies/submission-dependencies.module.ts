import { Module } from '@nestjs/common';
import { SubmissionDependenciesController } from './submission-dependencies.controller';
import { SubmissionDependenciesRepository } from './submission-dependencies.repository';
import { SubmissionDependenciesService } from './submission-dependencies.service';

@Module({
  controllers: [SubmissionDependenciesController],
  providers: [SubmissionDependenciesService, SubmissionDependenciesRepository],
  exports: [SubmissionDependenciesService],
})
export class SubmissionDependenciesModule {}
