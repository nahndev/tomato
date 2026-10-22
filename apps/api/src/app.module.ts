import { Module } from '@nestjs/common';
import { AppConfigModule } from '@tomato/config';
import { PrismaModule } from './common';
import { envSchema } from './config';
import { BoardsModule } from './modules/boards/boards.module';
import { HealthModule } from './modules/health/health.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { TemplateCategoriesModule } from './modules/template-categories/template-categories.module';
import { TemplateEditorModule } from './modules/template-editor/template-editor.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { UnitTypesModule } from './modules/unit-types/unit-types.module';
import { UnitsModule } from './modules/units/units.module';

@Module({
  imports: [
    AppConfigModule.forRoot(envSchema),
    PrismaModule,
    HealthModule,
    TemplateCategoriesModule,
    TemplatesModule,
    TemplateEditorModule,
    BoardsModule,
    SubmissionsModule,
    UnitTypesModule,
    UnitsModule,
  ],
})
export class AppModule {}
