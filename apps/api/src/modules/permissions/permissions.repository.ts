import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaErrorCode, PrismaService, isPrismaError } from "../../common";
import type { RolePermission as RolePermissionEntity } from "../../generated/prisma/client";
import type { PermissionFlags } from "./permissions.types";

@Injectable()
export class PermissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    departmentId: string,
    roleId: string | undefined,
    skip: number,
    take: number,
  ): Promise<{ items: RolePermissionEntity[]; total: number }> {
    const where = { departmentId, ...(roleId && { roleId }) };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.rolePermission.findMany({
        where,
        orderBy: [{ resource: "asc" }, { id: "asc" }],
        skip,
        take,
      }),
      this.prisma.rolePermission.count({ where }),
    ]);
    return { items, total };
  }

  findById(
    departmentId: string,
    id: string,
  ): Promise<RolePermissionEntity | null> {
    return this.prisma.rolePermission.findFirst({
      where: { id, departmentId },
    });
  }

  async create(
    departmentId: string,
    data: { roleId: string; resource: string } & PermissionFlags,
  ): Promise<RolePermissionEntity> {
    try {
      return await this.prisma.rolePermission.create({
        data: { ...data, departmentId },
      });
    } catch (error) {
      throw this.toConflict(error);
    }
  }

  async update(
    departmentId: string,
    id: string,
    data: PermissionFlags,
  ): Promise<RolePermissionEntity | null> {
    try {
      return await this.prisma.rolePermission.update({
        where: { id, departmentId },
        data,
      });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(departmentId: string, id: string): Promise<boolean> {
    const { count } = await this.prisma.rolePermission.deleteMany({
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
