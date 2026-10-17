import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationQuery } from '@tomato/schemas';
import type { PaginatedResponse, Template } from '@tomato/types';
import type { CreateTemplateDto } from './dto/create-template.dto';
import type { UpdateTemplateDto } from './dto/update-template.dto';
import type { Template as TemplateModel } from '../../generated/prisma/client';
import { TemplateCategoriesService } from '../template-categories';
import { TemplatesRepository } from './templates.repository';

function toTemplate(entity: TemplateModel): Template {
  return {
    ...entity,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

@Injectable()
export class TemplatesService {
  constructor(
    private readonly templatesRepository: TemplatesRepository,
    private readonly templateCategoriesService: TemplateCategoriesService,
  ) {}

  async list({ page, pageSize }: PaginationQuery): Promise<PaginatedResponse<Template>> {
    const { items, total } = await this.templatesRepository.findMany((page - 1) * pageSize, pageSize);
    return { items: items.map(toTemplate), total, page, pageSize };
  }

  async get(id: string): Promise<Template> {
    const entity = await this.templatesRepository.findById(id);
    if (!entity) throw new NotFoundException();
    return toTemplate(entity);
  }

  async create(dto: CreateTemplateDto): Promise<Template> {
    const categoryId = dto.categoryId ?? (await this.templateCategoriesService.getDefault()).id;
    return toTemplate(await this.templatesRepository.create({ ...dto, categoryId }));
  }

  async update(id: string, dto: UpdateTemplateDto): Promise<Template> {
    const entity = await this.templatesRepository.update(id, dto);
    if (!entity) throw new NotFoundException();
    return toTemplate(entity);
  }

  async remove(id: string): Promise<void> {
    if (!(await this.templatesRepository.delete(id))) throw new NotFoundException();
  }
}
