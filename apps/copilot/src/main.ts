import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import type { Env } from './config.schema';
import { CopilotService } from './modules/copilot/copilot.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(app.get(CopilotService).router);
  app.enableShutdownHooks();
  await app.listen(app.get<ConfigService<Env, true>>(ConfigService).get('COPILOT_PORT', { infer: true }));
}

void bootstrap();
