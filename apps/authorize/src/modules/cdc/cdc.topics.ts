import { Kafka, logLevel } from 'kafkajs';
import { CDC_TOPICS } from './cdc.constants';

export async function ensureCdcTopics(brokers: string[]) {
  const admin = new Kafka({ brokers, logLevel: logLevel.WARN }).admin();
  await admin.connect();
  try {
    await admin.createTopics({ waitForLeaders: true, topics: CDC_TOPICS.map((topic) => ({ topic })) });
  } finally {
    await admin.disconnect();
  }
}
