import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import type { TemplateSnapshot } from '@tomato/types';
import { TEMPLATE_SNAPSHOT_ROUTE } from './template.constants';
import { TemplateService } from './template.service';

@Controller(TEMPLATE_SNAPSHOT_ROUTE)
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  getSnapshot(@Param('templateId', ParseUUIDPipe) templateId: string): Promise<TemplateSnapshot> {
    return this.templateService.getSnapshot(templateId);
  }
}
