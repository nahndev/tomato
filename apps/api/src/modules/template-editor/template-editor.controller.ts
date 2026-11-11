import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TEMPLATE_VERSIONS_ROUTE } from './template-editor.constants';
import { TemplateEditorService } from './template-editor.service';
import type { TemplateVersionEntity } from './template-editor.types';

const TEMPLATE_ID_PARAM = { name: 'templateId', format: 'uuid' };

@ApiTags('template-versions')
@ApiParam(TEMPLATE_ID_PARAM)
@Controller(TEMPLATE_VERSIONS_ROUTE)
export class TemplateEditorController {
  constructor(private readonly templateEditorService: TemplateEditorService) {}

  @Get()
  @ApiOperation({ summary: 'List published versions of a template' })
  list(
    @Param('templateId', ParseUUIDPipe) templateId: string,
  ): Promise<TemplateVersionEntity[]> {
    return this.templateEditorService.listVersions(templateId);
  }

  @Post()
  @ApiOperation({ summary: 'Publish the current draft as a new version' })
  publish(@Param('templateId', ParseUUIDPipe) templateId: string): Promise<TemplateVersionEntity> {
    return this.templateEditorService.publish(templateId);
  }
}
