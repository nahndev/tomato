import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common';
import type { Env } from './config.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableShutdownHooks();
  await app.listen(app.get<ConfigService<Env, true>>(ConfigService).get('COLLAB_HTTP_PORT', { infer: true }));
}

void bootstrap();
