import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { MapPin } from '@tomato/types';
import { CreateMapPinDto } from './dto/create-map-pin.dto';
import { UpdateMapPinDto } from './dto/update-map-pin.dto';
import { MapsService } from './maps.service';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('maps')
@ApiParam({ name: 'mapId', format: 'uuid' })
@Controller('maps/:mapId/pins')
export class MapPinsController {
  constructor(private readonly mapsService: MapsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a pin to a map' })
  create(@Param('mapId', ParseUUIDPipe) mapId: string, @Body() dto: CreateMapPinDto): Promise<MapPin> {
    return this.mapsService.addPin(mapId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update or move a pin' })
  @ApiParam(ID_PARAM)
  update(
    @Param('mapId', ParseUUIDPipe) mapId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMapPinDto,
  ): Promise<MapPin> {
    return this.mapsService.updatePin(mapId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pin' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('mapId', ParseUUIDPipe) mapId: string, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.mapsService.removePin(mapId, id);
  }
}
