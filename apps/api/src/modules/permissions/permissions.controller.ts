import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import type { PaginatedResponse, RolePermission } from "@tomato/types";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { ListPermissionsQueryDto } from "./dto/list-permissions-query.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { PermissionsService } from "./permissions.service";

const DEPARTMENT_ID_PARAM = { name: "departmentId", format: "uuid" };
const ID_PARAM = { name: "id", format: "uuid" };

@ApiTags("permissions")
@ApiParam(DEPARTMENT_ID_PARAM)
@Controller("departments/:departmentId/permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: "List role permissions of a department" })
  list(
    @Param("departmentId", ParseUUIDPipe) departmentId: string,
    @Query() query: ListPermissionsQueryDto,
  ): Promise<PaginatedResponse<RolePermission>> {
    return this.permissionsService.list(departmentId, query, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a role permission" })
  @ApiParam(ID_PARAM)
  get(
    @Param("departmentId", ParseUUIDPipe) departmentId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<RolePermission> {
    return this.permissionsService.get(departmentId, id);
  }

  @Post()
  @ApiOperation({ summary: "Grant permissions on a resource to a role" })
  create(
    @Param("departmentId", ParseUUIDPipe) departmentId: string,
    @Body() dto: CreatePermissionDto,
  ): Promise<RolePermission> {
    return this.permissionsService.create(departmentId, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a role permission" })
  @ApiParam(ID_PARAM)
  update(
    @Param("departmentId", ParseUUIDPipe) departmentId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdatePermissionDto,
  ): Promise<RolePermission> {
    return this.permissionsService.update(departmentId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a role permission" })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param("departmentId", ParseUUIDPipe) departmentId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.permissionsService.remove(departmentId, id);
  }
}
