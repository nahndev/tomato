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
import type { PaginatedResponse, Role } from "@tomato/types";
import { PaginationQueryDto } from "../../common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RolesService } from "./roles.service";

const DEPARTMENT_ID_PARAM = { name: "departmentId", format: "uuid" };
const ID_PARAM = { name: "id", format: "uuid" };

@ApiTags("roles")
@ApiParam(DEPARTMENT_ID_PARAM)
@Controller("departments/:departmentId/roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: "List roles of a department" })
  list(
    @Param("departmentId", ParseUUIDPipe) departmentId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<Role>> {
    return this.rolesService.list(departmentId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a role" })
  @ApiParam(ID_PARAM)
  get(
    @Param("departmentId", ParseUUIDPipe) departmentId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<Role> {
    return this.rolesService.get(departmentId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create a role in a department" })
  create(
    @Param("departmentId", ParseUUIDPipe) departmentId: string,
    @Body() dto: CreateRoleDto,
  ): Promise<Role> {
    return this.rolesService.create(departmentId, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a role" })
  @ApiParam(ID_PARAM)
  update(
    @Param("departmentId", ParseUUIDPipe) departmentId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(departmentId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a role" })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param("departmentId", ParseUUIDPipe) departmentId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.rolesService.remove(departmentId, id);
  }
}
