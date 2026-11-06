import { Module } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { CdcController } from './cdc.controller';
import { CdcService } from './cdc.service';

@Module({
  imports: [GroupsModule],
  controllers: [CdcController],
  providers: [CdcService],
})
export class CdcModule {}
