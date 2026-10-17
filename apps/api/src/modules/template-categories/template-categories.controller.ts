import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { TemplateCategory } from '@tomato/types';
import { TEMPLATE_CATEGORIES_ROUTE } from './template-categories.constants';
import { TemplateCategoriesService } from './template-categories.service';

@ApiTags(TEMPLATE_CATEGORIES_ROUTE)
@Controller(TEMPLATE_CATEGORIES_ROUTE)
export class TemplateCategoriesController {
  constructor(private readonly templateCategoriesService: TemplateCategoriesService) {}

  @Get()
  list(): Promise<TemplateCategory[]> {
    return this.templateCategoriesService.list();
  }
}
