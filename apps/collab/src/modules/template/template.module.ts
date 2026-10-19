import { Module } from '@nestjs/common';
import { CollabModule } from '../collab/collab.module';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

@Module({
  imports: [CollabModule],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
