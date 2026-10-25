import { Injectable, NotFoundException } from '@nestjs/common';
import type { Document, PaginatedResponse } from '@tomato/types';
import type { PaginationQueryDto } from '../../common';
import { DepartmentsService } from '../departments/departments.service';
import { UsersService } from '../users/users.service';
import type { CreateDocumentDto } from './dto/create-document.dto';
import type { UpdateDocumentDto } from './dto/update-document.dto';
import { toDocument } from './documents.mapper';
import { DocumentsRepository } from './documents.repository';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly repository: DocumentsRepository,
    private readonly departmentsService: DepartmentsService,
    private readonly usersService: UsersService,
  ) {}

  async list(departmentId: string, { page, pageSize }: PaginationQueryDto): Promise<PaginatedResponse<Document>> {
    await this.departmentsService.get(departmentId);
    const { items, total } = await this.repository.findMany(departmentId, (page - 1) * pageSize, pageSize);
    return { items: items.map(toDocument), total, page, pageSize };
  }

  async get(departmentId: string, id: string): Promise<Document> {
    const entity = await this.repository.findById(departmentId, id);
    if (!entity) throw new NotFoundException();
    return toDocument(entity);
  }

  async create(departmentId: string, dto: CreateDocumentDto): Promise<Document> {
    await this.departmentsService.get(departmentId);
    await this.usersService.get(departmentId, dto.ownerId);
    return toDocument(
      await this.repository.create(departmentId, { title: dto.title, content: dto.content, ownerId: dto.ownerId }),
    );
  }

  async update(departmentId: string, id: string, dto: UpdateDocumentDto): Promise<Document> {
    const entity = await this.repository.update(departmentId, id, { title: dto.title, content: dto.content });
    if (!entity) throw new NotFoundException();
    return toDocument(entity);
  }

  async remove(departmentId: string, id: string): Promise<void> {
    if (!(await this.repository.delete(departmentId, id))) throw new NotFoundException();
  }
}
