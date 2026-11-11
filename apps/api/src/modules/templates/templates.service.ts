import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginatedResponse } from '../../common';
import type { Template } from '../../generated/prisma/client';
import type { PaginationQueryDto } from '../../common';
import type { CreateTemplateDto } from './dto/create-template.dto';
import type { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplateCategoriesService } from '../template-categories/template-categories.service';
import { TemplatesRepository } from './templates.repository';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly templatesRepository: TemplatesRepository,
    private readonly templateCategoriesService: TemplateCategoriesService,
  ) {}

  async list({ page, pageSize }: PaginationQueryDto): Promise<PaginatedResponse<Template>> {
    const { items, total } = await this.templatesRepository.findMany((page - 1) * pageSize, pageSize);
    return { items, total, page, pageSize };
  }

  async get(id: string): Promise<Template> {
    const entity = await this.templatesRepository.findById(id);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create(dto: CreateTemplateDto): Promise<Template> {
    const categoryId = dto.categoryId ?? (await this.templateCategoriesService.getDefault()).id;
    return this.templatesRepository.create({ ...dto, categoryId });
  }

  async update(id: string, dto: UpdateTemplateDto): Promise<Template> {
    const entity = await this.templatesRepository.update(id, dto);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async remove(id: string): Promise<void> {
    if (!(await this.templatesRepository.delete(id))) throw new NotFoundException();
  }
}
