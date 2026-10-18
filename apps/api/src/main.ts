import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter, RAW_BODY_LIMIT, SWAGGER_PATH, SWAGGER_TITLE, createValidationPipe } from './common';
import type { Env } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useBodyParser('raw', { type: 'application/octet-stream', limit: RAW_BODY_LIMIT });
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(createValidationPipe());
  const swaggerConfig = new DocumentBuilder().setTitle(SWAGGER_TITLE).setVersion('1.0').build();
  SwaggerModule.setup(SWAGGER_PATH, app, SwaggerModule.createDocument(app, swaggerConfig), { useGlobalPrefix: true });
  await app.listen(app.get<ConfigService<Env, true>>(ConfigService).get('PORT', { infer: true }));
}

void bootstrap();
