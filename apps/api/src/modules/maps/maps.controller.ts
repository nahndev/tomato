import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { PaginatedResponse } from '../../common';
import { PaginationQueryDto } from '../../common';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { MapsService } from './maps.service';
import type { MapEntity } from './maps.types';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('maps')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get()
  @ApiOperation({ summary: 'List maps' })
  list(@Query() query: PaginationQueryDto): Promise<PaginatedResponse<MapEntity>> {
    return this.mapsService.list(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a map' })
  create(@Body() dto: CreateMapDto): Promise<MapEntity> {
    return this.mapsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a map with its value' })
  @ApiParam(ID_PARAM)
  get(@Param('id', ParseUUIDPipe) id: string): Promise<MapEntity> {
    return this.mapsService.get(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rename a map or replace its value (image checked through the storage service)' })
  @ApiParam(ID_PARAM)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMapDto): Promise<MapEntity> {
    return this.mapsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a map' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.mapsService.remove(id);
  }
}
