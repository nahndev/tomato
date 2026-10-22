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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { UnitType } from '@tomato/types';
import { CreateUnitTypeDto } from './dto/create-unit-type.dto';
import { UpdateUnitTypeDto } from './dto/update-unit-type.dto';
import { UnitTypesService } from './unit-types.service';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('unit-types')
@Controller('unit-types')
export class UnitTypesController {
  constructor(private readonly unitTypesService: UnitTypesService) {}

  @Get()
  @ApiOperation({ summary: 'List unit types' })
  list(): Promise<UnitType[]> {
    return this.unitTypesService.list();
  }

  @Post()
  @ApiOperation({ summary: 'Create a unit type' })
  create(@Body() dto: CreateUnitTypeDto): Promise<UnitType> {
    return this.unitTypesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rename a unit type (default types are locked)' })
  @ApiParam(ID_PARAM)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUnitTypeDto): Promise<UnitType> {
    return this.unitTypesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an unused unit type (default types are locked)' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.unitTypesService.remove(id);
  }
}
