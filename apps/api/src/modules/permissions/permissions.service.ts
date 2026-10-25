import { Injectable, NotFoundException } from "@nestjs/common";
import type { PaginatedResponse, RolePermission } from "@tomato/types";
import type { PaginationQueryDto } from "../../common";
import { DepartmentsService } from "../departments/departments.service";
import { RolesService } from "../roles/roles.service";
import type { CreatePermissionDto } from "./dto/create-permission.dto";
import type { UpdatePermissionDto } from "./dto/update-permission.dto";
import { toRolePermission } from "./permissions.mapper";
import { PermissionsRepository } from "./permissions.repository";

@Injectable()
export class PermissionsService {
  constructor(
    private readonly repository: PermissionsRepository,
    private readonly departmentsService: DepartmentsService,
    private readonly rolesService: RolesService,
  ) {}

  async list(
    departmentId: string,
    roleId: string | undefined,
    { page, pageSize }: PaginationQueryDto,
  ): Promise<PaginatedResponse<RolePermission>> {
    await this.departmentsService.get(departmentId);
    const { items, total } = await this.repository.findMany(
      departmentId,
      roleId,
      (page - 1) * pageSize,
      pageSize,
    );
    return { items: items.map(toRolePermission), total, page, pageSize };
  }

  async get(departmentId: string, id: string): Promise<RolePermission> {
    const entity = await this.repository.findById(departmentId, id);
    if (!entity) throw new NotFoundException();
    return toRolePermission(entity);
  }

  async create(
    departmentId: string,
    dto: CreatePermissionDto,
  ): Promise<RolePermission> {
    await this.rolesService.get(departmentId, dto.roleId);
    return toRolePermission(
      await this.repository.create(departmentId, {
        roleId: dto.roleId,
        resource: dto.resource,
        canCreate: dto.canCreate,
        canRead: dto.canRead,
        canUpdate: dto.canUpdate,
        canDelete: dto.canDelete,
      }),
    );
  }

  async update(
    departmentId: string,
    id: string,
    dto: UpdatePermissionDto,
  ): Promise<RolePermission> {
    const entity = await this.repository.update(departmentId, id, {
      canCreate: dto.canCreate,
      canRead: dto.canRead,
      canUpdate: dto.canUpdate,
      canDelete: dto.canDelete,
    });
    if (!entity) throw new NotFoundException();
    return toRolePermission(entity);
  }

  async remove(departmentId: string, id: string): Promise<void> {
    if (!(await this.repository.delete(departmentId, id)))
      throw new NotFoundException();
  }
}
