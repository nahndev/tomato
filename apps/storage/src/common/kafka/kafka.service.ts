import { Injectable, Logger } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { Kafka, logLevel } from 'kafkajs';
import type { KafkaConfig } from 'kafkajs';
import type { Env } from '../../config.schema';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);
  private readonly client: KafkaConfig;
  private readonly groupId: string;

  constructor(config: ConfigService<Env, true>) {
    this.client = {
      brokers: config.get('KAFKA_BROKERS', { infer: true }),
      retry: { retries: config.get('KAFKA_RETRIES', { infer: true }) },
    };
    this.groupId = config.get('KAFKA_GROUP_ID', { infer: true });
  }

  startConsumer(app: INestApplication, topics: string[]) {
    const consumer = app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: { client: this.client, consumer: { groupId: this.groupId }, subscribe: { fromBeginning: true } },
    });
    void this.ensureTopics(topics)
      .then(() => consumer.listen())
      .catch((error: unknown) => this.logger.error(error));
  }

  private async ensureTopics(topics: string[]) {
    const admin = new Kafka({ ...this.client, logLevel: logLevel.WARN }).admin();
    await admin.connect();
    try {
      await admin.createTopics({ waitForLeaders: true, topics: topics.map((topic) => ({ topic })) });
    } finally {
      await admin.disconnect();
    }
  }
}
