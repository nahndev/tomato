import { Module } from '@nestjs/common';
import { PrismaModule } from './common';
import { HealthModule } from './modules/health';
import { TemplateCategoriesModule } from './modules/template-categories';
import { TemplatesModule } from './modules/templates';

@Module({ imports: [PrismaModule, HealthModule, TemplateCategoriesModule, TemplatesModule] })
export class AppModule {}
