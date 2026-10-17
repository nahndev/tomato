import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import type { TemplateCategory as TemplateCategoryModel } from '../../generated/prisma/client';

@Injectable()
export class TemplateCategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<TemplateCategoryModel[]> {
    return this.prisma.templateCategory.findMany({ orderBy: [{ isDefault: 'desc' }, { name: 'asc' }] });
  }

  findDefault(): Promise<TemplateCategoryModel | null> {
    return this.prisma.templateCategory.findFirst({ where: { isDefault: true } });
  }
}
