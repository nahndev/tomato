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
import type { PaginatedResponse, Unit } from '@tomato/types';
import { PaginationQueryDto } from '../../common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitsService } from './units.service';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @ApiOperation({ summary: 'List units' })
  list(@Query() query: PaginationQueryDto): Promise<PaginatedResponse<Unit>> {
    return this.unitsService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a unit' })
  @ApiParam(ID_PARAM)
  get(@Param('id', ParseUUIDPipe) id: string): Promise<Unit> {
    return this.unitsService.get(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a unit' })
  create(@Body() dto: CreateUnitDto): Promise<Unit> {
    return this.unitsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a unit (the system unit keeps its type)' })
  @ApiParam(ID_PARAM)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUnitDto): Promise<Unit> {
    return this.unitsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a unit (the system unit cannot be deleted)' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.unitsService.remove(id);
  }
}
