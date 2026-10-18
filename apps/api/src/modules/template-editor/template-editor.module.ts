import { Module } from '@nestjs/common';
import { TemplatesModule } from '../templates/templates.module';
import { TemplateEditorController } from './template-editor.controller';
import { TemplateEditorRepository } from './template-editor.repository';
import { TemplateEditorService } from './template-editor.service';

@Module({
  imports: [TemplatesModule],
  controllers: [TemplateEditorController],
  providers: [TemplateEditorService, TemplateEditorRepository],
})
export class TemplateEditorModule {}
