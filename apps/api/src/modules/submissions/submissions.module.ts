import { Module } from '@nestjs/common';
import { SubmissionDependenciesModule } from '../submission-dependencies/submission-dependencies.module';
import { SubmissionBehaviorsService } from './submission-behaviors.service';
import { SubmissionMetaService } from './submission-meta.service';
import { SubmissionValuesService } from './submission-values.service';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsRepository } from './submissions.repository';
import { SubmissionsService } from './submissions.service';

@Module({
  imports: [SubmissionDependenciesModule],
  controllers: [SubmissionsController],
  providers: [
    SubmissionsService,
    SubmissionBehaviorsService,
    SubmissionValuesService,
    SubmissionMetaService,
    SubmissionsRepository,
  ],
})
export class SubmissionsModule {}
