import { Injectable, NotFoundException } from "@nestjs/common";
import type { PaginatedResponse } from "../../common";
import type { Role } from "../../generated/prisma/client";
import type { PaginationQueryDto } from "../../common";
import { DepartmentsService } from "../departments/departments.service";
import type { CreateRoleDto } from "./dto/create-role.dto";
import type { UpdateRoleDto } from "./dto/update-role.dto";
import { RolesRepository } from "./roles.repository";

@Injectable()
export class RolesService {
  constructor(
    private readonly repository: RolesRepository,
    private readonly departmentsService: DepartmentsService,
  ) {}

  async list(
    departmentId: string,
    { page, pageSize }: PaginationQueryDto,
  ): Promise<PaginatedResponse<Role>> {
    await this.departmentsService.get(departmentId);
    const { items, total } = await this.repository.findMany(
      departmentId,
      (page - 1) * pageSize,
      pageSize,
    );
    return { items, total, page, pageSize };
  }

  async get(departmentId: string, id: string): Promise<Role> {
    const entity = await this.repository.findById(departmentId, id);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create(departmentId: string, dto: CreateRoleDto): Promise<Role> {
    await this.departmentsService.get(departmentId);
    return this.repository.create(departmentId, { name: dto.name });
  }

  async update(
    departmentId: string,
    id: string,
    dto: UpdateRoleDto,
  ): Promise<Role> {
    const entity = await this.repository.update(departmentId, id, {
      name: dto.name,
      description: dto.description,
      color: dto.color,
      status: dto.status,
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async remove(departmentId: string, id: string): Promise<void> {
    if (!(await this.repository.delete(departmentId, id)))
      throw new NotFoundException();
  }
}
