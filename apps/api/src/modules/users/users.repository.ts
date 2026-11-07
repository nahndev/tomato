import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import { USER_INCLUDE } from './users.constants';
import type { UserUpdateData, UserWithRelations } from './users.types';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    departmentId: string,
    skip: number,
    take: number,
    roleId?: string,
  ): Promise<{ items: UserWithRelations[]; total: number }> {
    const where = { departmentId, ...(roleId && { roles: { some: { roleId } } }) };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: USER_INCLUDE,
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
        skip,
        take,
      }),
      this.prisma.user.count({ where }),
    ]);
    return { items, total };
  }

  findById(departmentId: string, id: string): Promise<UserWithRelations | null> {
    return this.prisma.user.findFirst({ where: { id, departmentId }, include: USER_INCLUDE });
  }

  countRoles(departmentId: string, roleIds: string[]): Promise<number> {
    return this.prisma.role.count({ where: { departmentId, id: { in: roleIds } } });
  }

  async create(departmentId: string, data: { name: string; email: string }): Promise<UserWithRelations> {
    try {
      return await this.prisma.user.create({ data: { ...data, departmentId }, include: USER_INCLUDE });
    } catch (error) {
      throw this.toConflict(error);
    }
  }

  async update(
    departmentId: string,
    id: string,
    { addresses, roleIds, ...fields }: UserUpdateData,
  ): Promise<UserWithRelations | null> {
    try {
      return await this.prisma.user.update({
        where: { id, departmentId },
        include: USER_INCLUDE,
        data: {
          ...fields,
          addresses: addresses && {
            deleteMany: {},
            create: addresses.map((address, position) => ({ ...address, position })),
          },
          // Diffed so a role the user keeps never emits a CDC delete that briefly revokes it.
          roles: roleIds && {
            deleteMany: { roleId: { notIn: roleIds } },
            createMany: { data: roleIds.map((roleId) => ({ roleId })), skipDuplicates: true },
          },
        },
      });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw this.toConflict(error);
    }
  }

  async delete(departmentId: string, id: string): Promise<boolean> {
    const { count } = await this.prisma.user.deleteMany({ where: { id, departmentId } });
    return count > 0;
  }

  private toConflict(error: unknown): unknown {
    return isPrismaError(error, PrismaErrorCode.UNIQUE_VIOLATION) ? new ConflictException() : error;
  }
}
