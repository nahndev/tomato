import { Module } from '@nestjs/common';
import { AppConfigModule } from '@tomato/config';
import { envSchema } from './config.schema';
import { CopilotModule } from './modules/copilot/copilot.module';

@Module({ imports: [AppConfigModule.forRoot(envSchema), CopilotModule] })
export class AppModule {}
