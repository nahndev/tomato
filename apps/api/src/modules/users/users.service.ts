import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginatedResponse, User } from '@tomato/types';
import type { PaginationQueryDto } from '../../common';
import { DepartmentsService } from '../departments/departments.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { toUser } from './users.mapper';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly departmentsService: DepartmentsService,
  ) {}

  async list(departmentId: string, { page, pageSize }: PaginationQueryDto): Promise<PaginatedResponse<User>> {
    await this.departmentsService.get(departmentId);
    const { items, total } = await this.repository.findMany(departmentId, (page - 1) * pageSize, pageSize);
    return { items: items.map(toUser), total, page, pageSize };
  }

  async get(departmentId: string, id: string): Promise<User> {
    const entity = await this.repository.findById(departmentId, id);
    if (!entity) throw new NotFoundException();
    return toUser(entity);
  }

  async create(departmentId: string, dto: CreateUserDto): Promise<User> {
    await this.departmentsService.get(departmentId);
    return toUser(await this.repository.create(departmentId, { name: dto.name, email: dto.email }));
  }

  async update(departmentId: string, id: string, dto: UpdateUserDto): Promise<User> {
    const entity = await this.repository.update(departmentId, id, { name: dto.name, email: dto.email });
    if (!entity) throw new NotFoundException();
    return toUser(entity);
  }

  async remove(departmentId: string, id: string): Promise<void> {
    if (!(await this.repository.delete(departmentId, id))) throw new NotFoundException();
  }
}
