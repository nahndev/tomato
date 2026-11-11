import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { PaginatedResponse } from '../../common';
import { PaginationQueryDto } from '../../common';
import { CreateMapDto } from './dto/create-map.dto';
import { MapsService } from './maps.service';
import type { DepartmentMapEntity } from './maps.types';

@ApiTags('maps')
@ApiParam({ name: 'departmentId', format: 'uuid' })
@Controller('departments/:departmentId/maps')
export class DepartmentMapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get()
  @ApiOperation({ summary: 'List maps of a department' })
  list(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<DepartmentMapEntity>> {
    return this.mapsService.list(departmentId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a map in a department' })
  create(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Body() dto: CreateMapDto,
  ): Promise<DepartmentMapEntity> {
    return this.mapsService.create(departmentId, dto);
  }
}
