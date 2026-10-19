import { Module } from '@nestjs/common';
import { AppConfigModule } from '@tomato/config';
import { envSchema } from './config.schema';
import { CollabModule } from './modules/collab/collab.module';
import { TemplateModule } from './modules/template/template.module';

@Module({ imports: [AppConfigModule.forRoot(envSchema), CollabModule, TemplateModule] })
export class AppModule {}
