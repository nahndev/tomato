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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { Department, PaginatedResponse } from '@tomato/types';
import { PaginationQueryDto } from '../../common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentsService } from './departments.service';

const ID_PARAM = { name: 'id', format: 'uuid' };

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
  @ApiParam(ID_PARAM)
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
  @ApiParam(ID_PARAM)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDepartmentDto): Promise<Department> {
    return this.departmentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a department' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.departmentsService.remove(id);
  }
}
