import { Module } from '@nestjs/common';
import { TemplatesModule } from '../templates/templates.module';
import { TemplateEditorController } from './template-editor.controller';
import { TemplateEditorRepository } from './template-editor.repository';
import { TemplateEditorService } from './template-editor.service';
import { TemplateSnapshotClient } from './template-snapshot.client';

@Module({
  imports: [TemplatesModule],
  controllers: [TemplateEditorController],
  providers: [TemplateEditorService, TemplateEditorRepository, TemplateSnapshotClient],
})
export class TemplateEditorModule {}
