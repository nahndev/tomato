import { Module } from '@nestjs/common';
import { AppConfigModule } from '@tomato/config';
import { envSchema } from './config.schema';
import { CollabModule } from './modules/collab/collab.module';

@Module({ imports: [AppConfigModule.forRoot(envSchema), CollabModule] })
export class AppModule {}
