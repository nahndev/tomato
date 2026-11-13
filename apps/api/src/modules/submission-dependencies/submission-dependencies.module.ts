import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { SubmissionDependenciesController } from './submission-dependencies.controller';
import { SubmissionDependenciesRealtimeListener } from './submission-dependencies-realtime.listener';
import { SubmissionDependenciesRepository } from './submission-dependencies.repository';
import { SubmissionDependenciesService } from './submission-dependencies.service';

@Module({
  imports: [RealtimeModule],
  controllers: [SubmissionDependenciesController],
  providers: [SubmissionDependenciesService, SubmissionDependenciesRepository, SubmissionDependenciesRealtimeListener],
  exports: [SubmissionDependenciesService],
})
export class SubmissionDependenciesModule {}
