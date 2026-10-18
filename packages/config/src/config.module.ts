import { Module } from '@nestjs/common';
import type { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { z } from 'zod';
import { createEnvValidator } from './validate-env';

@Module({})
export class AppConfigModule {
  static forRoot<T extends Record<string, unknown>>(schema: z.ZodType<T>): DynamicModule {
    return {
      module: AppConfigModule,
      global: true,
      imports: [ConfigModule.forRoot({ isGlobal: true, validate: createEnvValidator(schema) })],
    };
  }
}
