import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import type { MicroserviceOptions } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GLOBAL_PREFIX, HttpExceptionFilter, SWAGGER_PATH, SWAGGER_TITLE, createValidationPipe } from './common';
import type { Env } from './config.schema';
import { ensureCdcTopics } from './modules/cdc/cdc.topics';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService<Env, true>>(ConfigService);
  const brokers = config.get('KAFKA_BROKERS', { infer: true });

  await ensureCdcTopics(brokers);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers },
      consumer: { groupId: config.get('KAFKA_GROUP_ID', { infer: true }) },
      subscribe: { fromBeginning: true },
    },
  });

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(createValidationPipe());
  const swaggerConfig = new DocumentBuilder().setTitle(SWAGGER_TITLE).setVersion('1.0').build();
  SwaggerModule.setup(SWAGGER_PATH, app, SwaggerModule.createDocument(app, swaggerConfig), { useGlobalPrefix: true });
  app.enableShutdownHooks();

  await app.startAllMicroservices();
  await app.listen(config.get('STORAGE_PORT', { infer: true }));
}

void bootstrap();
