import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import type { TemplateSnapshot } from './template.types';
import { TemplateService } from './template.service';

@Controller('templates/:templateId/snapshot')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  getSnapshot(@Param('templateId', ParseUUIDPipe) templateId: string): Promise<TemplateSnapshot> {
    return this.templateService.getSnapshot(templateId);
  }
}
