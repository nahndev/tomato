import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateMapDto } from './dto/update-map.dto';
import { MapsService } from './maps.service';
import type { DepartmentMapEntity } from './maps.types';

@ApiTags('maps')
@ApiParam({ name: 'id', format: 'uuid' })
@Controller('maps/:id')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a map with its value' })
  get(@Param('id', ParseUUIDPipe) id: string): Promise<DepartmentMapEntity> {
    return this.mapsService.get(id);
  }

  @Patch()
  @ApiOperation({ summary: 'Rename a map or replace its value (image checked through the storage service)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMapDto): Promise<DepartmentMapEntity> {
    return this.mapsService.update(id, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a map' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.mapsService.remove(id);
  }
}
