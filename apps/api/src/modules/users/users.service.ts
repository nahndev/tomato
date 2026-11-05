import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { PaginatedResponse, User } from '@tomato/types';
import type { PaginationQueryDto } from '../../common';
import { DepartmentsService } from '../departments/departments.service';
import { avatarTypeFromKey, detectAvatarType } from './avatar-type';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UsersAvatarStorage } from './users-avatar.storage';
import { AvatarExtension } from './users.constants';
import { toUser } from './users.mapper';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly departmentsService: DepartmentsService,
    private readonly avatarStorage: UsersAvatarStorage,
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
    const entity = await this.repository.findById(departmentId, id);
    if (!entity || !(await this.repository.delete(departmentId, id))) throw new NotFoundException();
    if (entity.avatarKey) await this.avatarStorage.remove(entity.avatarKey);
  }

  async uploadAvatar(departmentId: string, id: string, content?: Buffer): Promise<User> {
    const current = await this.repository.findById(departmentId, id);
    if (!current) throw new NotFoundException();
    const type = content && detectAvatarType(content);
    if (!type) throw new BadRequestException();

    const avatarKey = await this.avatarStorage.save(content, AvatarExtension[type]);
    const entity = await this.repository.update(departmentId, id, { avatarKey });
    if (!entity) {
      await this.avatarStorage.remove(avatarKey);
      throw new NotFoundException();
    }
    if (current.avatarKey) await this.avatarStorage.remove(current.avatarKey);
    return toUser(entity);
  }

  async getAvatar(departmentId: string, id: string): Promise<{ content: Buffer; type: string }> {
    const entity = await this.repository.findById(departmentId, id);
    const type = entity?.avatarKey && avatarTypeFromKey(entity.avatarKey);
    const content = entity?.avatarKey && type ? await this.avatarStorage.read(entity.avatarKey) : null;
    if (!content || !type) throw new NotFoundException();
    return { content, type };
  }
}
