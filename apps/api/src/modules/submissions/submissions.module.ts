import { Module } from '@nestjs/common';
import { SubmissionDependenciesModule } from '../submission-dependencies/submission-dependencies.module';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsRepository } from './submissions.repository';
import { SubmissionsService } from './submissions.service';

@Module({
  imports: [SubmissionDependenciesModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, SubmissionsRepository],
})
export class SubmissionsModule {}
