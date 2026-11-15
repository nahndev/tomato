import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUuidParam } from '../../common';
import { TemplateVersionsService } from './template-versions.service';
import type { TemplateVersionEntity } from './template-versions.types';

@ApiTags('template-versions')
@ApiUuidParam('templateId')
@Controller('templates/:templateId/versions')
export class TemplateVersionsController {
  constructor(private readonly templateVersionsService: TemplateVersionsService) {}

  @Get()
  @ApiOperation({ summary: 'List published versions of a template' })
  list(
    @Param('templateId', ParseUUIDPipe) templateId: string,
  ): Promise<TemplateVersionEntity[]> {
    return this.templateVersionsService.listVersions(templateId);
  }

  @Post()
  @ApiOperation({ summary: 'Publish the current draft as a new version' })
  publish(@Param('templateId', ParseUUIDPipe) templateId: string): Promise<TemplateVersionEntity> {
    return this.templateVersionsService.publish(templateId);
  }
}
