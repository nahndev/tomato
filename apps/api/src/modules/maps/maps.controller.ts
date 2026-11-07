import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { DepartmentMap, DepartmentMapDetail } from '@tomato/types';
import { SetMapImageDto } from './dto/set-map-image.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { MapsService } from './maps.service';

@ApiTags('maps')
@ApiParam({ name: 'id', format: 'uuid' })
@Controller('maps/:id')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a map with its pins' })
  get(@Param('id', ParseUUIDPipe) id: string): Promise<DepartmentMapDetail> {
    return this.mapsService.get(id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update a map' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMapDto): Promise<DepartmentMap> {
    return this.mapsService.update(id, dto);
  }

  @Put('image')
  @ApiOperation({ summary: 'Set the image of a map from a file of the storage service' })
  setImage(@Param('id', ParseUUIDPipe) id: string, @Body() { fileId }: SetMapImageDto): Promise<DepartmentMap> {
    return this.mapsService.setImage(id, fileId);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a map and its pins' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.mapsService.remove(id);
  }
}
