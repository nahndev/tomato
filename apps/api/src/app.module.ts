import { Module } from '@nestjs/common';
import { PrismaModule } from './common';
import { HealthModule } from './modules/health';
import { TemplatesModule } from './modules/templates';

@Module({ imports: [PrismaModule, HealthModule, TemplatesModule] })
export class AppModule {}
