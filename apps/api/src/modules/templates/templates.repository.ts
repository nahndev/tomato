import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../common';
import type { CreateTemplateDto } from './dto/create-template.dto';
import type { UpdateTemplateDto } from './dto/update-template.dto';
import type { Template as TemplateModel } from '../../generated/prisma/client';

const RECORD_NOT_FOUND = 'P2025';

function isRecordNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === RECORD_NOT_FOUND;
}

@Injectable()
export class TemplatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(skip: number, take: number): Promise<{ items: TemplateModel[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.template.findMany({ orderBy: { createdAt: 'desc' }, skip, take }),
      this.prisma.template.count(),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<TemplateModel | null> {
    return this.prisma.template.findUnique({ where: { id } });
  }

  create(data: CreateTemplateDto & { categoryId: string }): Promise<TemplateModel> {
    return this.prisma.template.create({ data });
  }

  async update(id: string, data: UpdateTemplateDto): Promise<TemplateModel | null> {
    try {
      return await this.prisma.template.update({ where: { id }, data });
    } catch (error) {
      if (isRecordNotFound(error)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.template.delete({ where: { id } });
      return true;
    } catch (error) {
      if (isRecordNotFound(error)) return false;
      throw error;
    }
  }
}
