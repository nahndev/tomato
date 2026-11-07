import { BadRequestException, Injectable, NotFoundException, PayloadTooLargeException } from '@nestjs/common';
import { AVATAR_MAX_SIZE } from '@tomato/constants';
import type { PaginatedResponse, User } from '@tomato/types';
import { StorageFileClient, detectImageType } from '../../common';
import { DepartmentsService } from '../departments/departments.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { ListUsersQueryDto } from './dto/list-users-query.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { toUser } from './users.mapper';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly departmentsService: DepartmentsService,
    private readonly storageFiles: StorageFileClient,
  ) {}

  async list(departmentId: string, { page, pageSize, roleId }: ListUsersQueryDto): Promise<PaginatedResponse<User>> {
    await this.departmentsService.get(departmentId);
    const { items, total } = await this.repository.findMany(departmentId, (page - 1) * pageSize, pageSize, roleId);
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
    if (dto.roleIds?.length) {
      const count = await this.repository.countRoles(departmentId, dto.roleIds);
      if (count !== dto.roleIds.length) throw new NotFoundException();
    }
    const entity = await this.repository.update(departmentId, id, {
      eid: dto.eid,
      name: dto.name,
      familyName: dto.familyName,
      email: dto.email,
      tel: dto.tel,
      addresses: dto.addresses?.map(({ street, city, postalCode, country }) => ({
        street,
        city,
        postalCode: postalCode ?? null,
        country,
      })),
      roleIds: dto.roleIds,
    });
    if (!entity) throw new NotFoundException();
    return toUser(entity);
  }

  async remove(departmentId: string, id: string): Promise<void> {
    if (!(await this.repository.delete(departmentId, id))) throw new NotFoundException();
  }

  async uploadAvatar(departmentId: string, id: string, fileId: string): Promise<User> {
    if (!(await this.repository.findById(departmentId, id))) throw new NotFoundException();
    const content = await this.storageFiles.fetchContent(fileId);
    if (!content) throw new NotFoundException();
    if (content.length > AVATAR_MAX_SIZE) throw new PayloadTooLargeException();
    if (!detectImageType(content)) throw new BadRequestException();

    const entity = await this.repository.update(departmentId, id, { avatarFileId: fileId });
    if (!entity) throw new NotFoundException();
    return toUser(entity);
  }
}
