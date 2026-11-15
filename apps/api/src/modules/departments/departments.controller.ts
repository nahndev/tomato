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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUuidParam } from '../../common';
import type { PaginatedResponse } from '../../common';
import type { Department } from '../../generated/prisma/client';
import { PaginationQueryDto } from '../../common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentsService } from './departments.service';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List departments' })
  list(@Query() query: PaginationQueryDto): Promise<PaginatedResponse<Department>> {
    return this.departmentsService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department' })
  @ApiUuidParam()
  get(@Param('id', ParseUUIDPipe) id: string): Promise<Department> {
    return this.departmentsService.get(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a department' })
  create(@Body() dto: CreateDepartmentDto): Promise<Department> {
    return this.departmentsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a department' })
  @ApiUuidParam()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDepartmentDto): Promise<Department> {
    return this.departmentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a department' })
  @ApiUuidParam()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.departmentsService.remove(id);
  }
}
