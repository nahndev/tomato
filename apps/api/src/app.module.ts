import { Module } from '@nestjs/common';
import { AppConfigModule } from '@tomato/config';
import { PrismaModule } from './common';
import { envSchema } from './config';
import { HealthModule } from './modules/health/health.module';
import { TemplateCategoriesModule } from './modules/template-categories/template-categories.module';
import { TemplateEditorModule } from './modules/template-editor/template-editor.module';
import { TemplatesModule } from './modules/templates/templates.module';

@Module({
  imports: [
    AppConfigModule.forRoot(envSchema),
    PrismaModule,
    HealthModule,
    TemplateCategoriesModule,
    TemplatesModule,
    TemplateEditorModule,
  ],
})
export class AppModule {}
