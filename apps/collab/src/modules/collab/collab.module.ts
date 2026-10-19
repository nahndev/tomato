import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { SubmissionModule } from '../submission/submission.module';
import { CollabGateway } from './collab.gateway';
import { CollabService } from './collab.service';

@Module({
  imports: [StorageModule, SubmissionModule],
  providers: [CollabGateway, CollabService],
  exports: [CollabGateway],
})
export class CollabModule {}
