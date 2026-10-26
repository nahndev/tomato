import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaErrorCode, PrismaService, isPrismaError } from "../../common";
import type { RolePermission as RolePermissionEntity } from "../../generated/prisma/client";
import type { PermissionFilter, PermissionFlags } from "./permissions.types";

@Injectable()
export class PermissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    departmentId: string,
    { roleId, resourceType, resourceId }: PermissionFilter,
    skip: number,
    take: number,
  ): Promise<{ items: RolePermissionEntity[]; total: number }> {
    const where = {
      role: { departmentId },
      ...(roleId && { roleId }),
      ...(resourceType && { resourceType }),
      ...(resourceId && { resourceId }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.rolePermission.findMany({
        where,
        orderBy: [{ resourceType: "asc" }, { resourceId: "asc" }, { id: "asc" }],
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
      where: { id, role: { departmentId } },
    });
  }

  async create(
    data: { roleId: string; resourceType: string; resourceId: string } & PermissionFlags,
  ): Promise<RolePermissionEntity> {
    try {
      return await this.prisma.rolePermission.create({ data });
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
        where: { id, role: { departmentId } },
        data,
      });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(departmentId: string, id: string): Promise<boolean> {
    const { count } = await this.prisma.rolePermission.deleteMany({
      where: { id, role: { departmentId } },
    });
    return count > 0;
  }

  private toConflict(error: unknown): unknown {
    return isPrismaError(error, PrismaErrorCode.UNIQUE_VIOLATION)
      ? new ConflictException()
      : error;
  }
}
