import { Injectable, NotFoundException } from "@nestjs/common";
import { PERMISSION_RESOURCE_ALL, PermissionResource } from "@tomato/constants";
import type { PaginatedResponse, RolePermission } from "@tomato/types";
import type { PaginationQueryDto } from "../../common";
import { DepartmentsService } from "../departments/departments.service";
import { DocumentsService } from "../documents/documents.service";
import { RolesService } from "../roles/roles.service";
import { UsersService } from "../users/users.service";
import type { CreatePermissionDto } from "./dto/create-permission.dto";
import type { PermissionResourceDto } from "./dto/permission-resource.dto";
import type { UpdatePermissionDto } from "./dto/update-permission.dto";
import { toRolePermission } from "./permissions.mapper";
import { PermissionsRepository } from "./permissions.repository";
import type { PermissionFilter } from "./permissions.types";

@Injectable()
export class PermissionsService {
  constructor(
    private readonly repository: PermissionsRepository,
    private readonly departmentsService: DepartmentsService,
    private readonly rolesService: RolesService,
    private readonly documentsService: DocumentsService,
    private readonly usersService: UsersService,
  ) {}

  async list(
    departmentId: string,
    filter: PermissionFilter,
    { page, pageSize }: PaginationQueryDto,
  ): Promise<PaginatedResponse<RolePermission>> {
    await this.departmentsService.get(departmentId);
    const { items, total } = await this.repository.findMany(
      departmentId,
      filter,
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
    await this.assertResourceExists(departmentId, dto.resource);
    return toRolePermission(
      await this.repository.create({
        roleId: dto.roleId,
        resourceType: dto.resource.type,
        resourceId: dto.resource.id,
        canCreate: dto.canCreate,
        canRead: dto.canRead,
        canUpdate: dto.canUpdate,
        canDelete: dto.canDelete,
      }),
    );
  }

  private async assertResourceExists(
    departmentId: string,
    { type, id }: PermissionResourceDto,
  ): Promise<void> {
    if (id === PERMISSION_RESOURCE_ALL) return;
    if (type === PermissionResource.DOCUMENT)
      await this.documentsService.get(departmentId, id);
    else await this.usersService.get(departmentId, id);
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
