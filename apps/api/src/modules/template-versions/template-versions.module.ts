import { Module } from '@nestjs/common';
import { TemplatesModule } from '../templates/templates.module';
import { TemplateVersionsController } from './template-versions.controller';
import { TemplateVersionsRepository } from './template-versions.repository';
import { TemplateVersionsService } from './template-versions.service';
import { TemplateSnapshotClient } from './template-snapshot.client';

@Module({
  imports: [TemplatesModule],
  controllers: [TemplateVersionsController],
  providers: [TemplateVersionsService, TemplateVersionsRepository, TemplateSnapshotClient],
})
export class TemplateVersionsModule {}
