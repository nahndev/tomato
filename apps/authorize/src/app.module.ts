import { Module } from '@nestjs/common';
import { AppConfigModule } from '@tomato/config';
import { envSchema } from './config.schema';
import { CdcModule } from './modules/cdc/cdc.module';
import { SpiceDbModule } from './modules/spicedb/spicedb.module';

@Module({ imports: [AppConfigModule.forRoot(envSchema), SpiceDbModule, CdcModule] })
export class AppModule {}
