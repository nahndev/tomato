import { Module } from '@nestjs/common';
import { CollabModule } from '../collab/collab.module';
import { SubmissionValuesController } from './submission-values.controller';
import { SubmissionValuesService } from './submission-values.service';

@Module({
  imports: [CollabModule],
  controllers: [SubmissionValuesController],
  providers: [SubmissionValuesService],
})
export class SubmissionValuesModule {}
