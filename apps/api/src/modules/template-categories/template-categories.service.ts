import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { TemplateCategory } from '@tomato/types';
import { TemplateCategoriesRepository } from './template-categories.repository';

@Injectable()
export class TemplateCategoriesService {
  constructor(private readonly templateCategoriesRepository: TemplateCategoriesRepository) {}

  list(): Promise<TemplateCategory[]> {
    return this.templateCategoriesRepository.findAll();
  }

  async getDefault(): Promise<TemplateCategory> {
    const category = await this.templateCategoriesRepository.findDefault();
    if (!category) throw new InternalServerErrorException();
    return category;
  }
}
