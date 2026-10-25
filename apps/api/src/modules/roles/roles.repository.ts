import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaErrorCode, PrismaService, isPrismaError } from "../../common";
import type { Role as RoleEntity } from "../../generated/prisma/client";

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    departmentId: string,
    skip: number,
    take: number,
  ): Promise<{ items: RoleEntity[]; total: number }> {
    const where = { departmentId };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.role.findMany({
        where,
        orderBy: [{ name: "asc" }, { id: "asc" }],
        skip,
        take,
      }),
      this.prisma.role.count({ where }),
    ]);
    return { items, total };
  }

  findById(departmentId: string, id: string): Promise<RoleEntity | null> {
    return this.prisma.role.findFirst({ where: { id, departmentId } });
  }

  async create(
    departmentId: string,
    data: { name: string },
  ): Promise<RoleEntity> {
    try {
      return await this.prisma.role.create({ data: { ...data, departmentId } });
    } catch (error) {
      throw this.toConflict(error);
    }
  }

  async update(
    departmentId: string,
    id: string,
    data: { name?: string },
  ): Promise<RoleEntity | null> {
    try {
      return await this.prisma.role.update({
        where: { id, departmentId },
        data,
      });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw this.toConflict(error);
    }
  }

  async delete(departmentId: string, id: string): Promise<boolean> {
    const { count } = await this.prisma.role.deleteMany({
      where: { id, departmentId },
    });
    return count > 0;
  }

  private toConflict(error: unknown): unknown {
    return isPrismaError(error, PrismaErrorCode.UNIQUE_VIOLATION)
      ? new ConflictException()
      : error;
  }
}
