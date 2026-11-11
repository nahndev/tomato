import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginatedResponse } from '../../common';
import type { Department } from '../../generated/prisma/client';
import type { PaginationQueryDto } from '../../common';
import type { CreateDepartmentDto } from './dto/create-department.dto';
import type { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentsRepository } from './departments.repository';

@Injectable()
export class DepartmentsService {
  constructor(private readonly repository: DepartmentsRepository) {}

  async list({ page, pageSize }: PaginationQueryDto): Promise<PaginatedResponse<Department>> {
    const { items, total } = await this.repository.findMany((page - 1) * pageSize, pageSize);
    return { items, total, page, pageSize };
  }

  async get(id: string): Promise<Department> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    return this.repository.create({ name: dto.name });
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const entity = await this.repository.update(id, { name: dto.name });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async remove(id: string): Promise<void> {
    if (!(await this.repository.delete(id))) throw new NotFoundException();
  }
}
