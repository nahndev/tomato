import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { CollabGateway } from './collab.gateway';
import { CollabService } from './collab.service';

@Module({
  imports: [StorageModule],
  providers: [CollabGateway, CollabService],
})
export class CollabModule {}
