import { existsSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envSchema } from './config.schema';
import { ensureCdcTopics } from './modules/cdc/cdc.topics';

const ENV_FILE = '.env';

async function bootstrap() {
  if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);
  const env = envSchema.parse(process.env);
  await ensureCdcTopics(env.KAFKA_BROKERS);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: { brokers: env.KAFKA_BROKERS },
      consumer: { groupId: env.KAFKA_GROUP_ID },
      subscribe: { fromBeginning: true },
    },
  });
  app.enableShutdownHooks();
  await app.listen();
}

void bootstrap();
