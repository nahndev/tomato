import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { TemplateCategory } from '@tomato/types';
import { TemplateCategoriesService } from './template-categories.service';

@ApiTags('template-categories')
@Controller('template-categories')
export class TemplateCategoriesController {
  constructor(private readonly templateCategoriesService: TemplateCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List template categories' })
  list(): Promise<TemplateCategory[]> {
    return this.templateCategoriesService.list();
  }
}
