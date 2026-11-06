import { Module } from '@nestjs/common';
import { AppConfigModule } from '@tomato/config';
import { PrismaModule } from './common';
import { envSchema } from './config.schema';
import { CdcModule } from './modules/cdc/cdc.module';
import { FilesModule } from './modules/files/files.module';
import { FoldersModule } from './modules/folders/folders.module';
import { GroupsModule } from './modules/groups/groups.module';

@Module({ imports: [AppConfigModule.forRoot(envSchema), PrismaModule, FilesModule, FoldersModule, GroupsModule, CdcModule] })
export class AppModule {}
