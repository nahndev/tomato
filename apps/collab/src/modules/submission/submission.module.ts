import { Module } from '@nestjs/common';
import { SubmissionApiClient } from './submission-api.client';
import { SubmissionService } from './submission.service';

@Module({
  providers: [SubmissionService, SubmissionApiClient],
  exports: [SubmissionService],
})
export class SubmissionModule {}
