import { Module } from '@nestjs/common';
import { MapperModule } from '../mapper/mapper.module';
import { RelationshipModule } from '../relationship/relationship.module';
import { CdcController } from './cdc.controller';
import { RelationshipSyncService } from './relationship-sync.service';

@Module({
  imports: [RelationshipModule, MapperModule],
  controllers: [CdcController],
  providers: [RelationshipSyncService],
})
export class CdcModule {}
