import { Module } from '@nestjs/common';
import { SpiceDbModule } from '../spicedb/spicedb.module';
import { CdcController } from './cdc.controller';
import { CdcService } from './cdc.service';

@Module({ imports: [SpiceDbModule], controllers: [CdcController], providers: [CdcService] })
export class CdcModule {}
