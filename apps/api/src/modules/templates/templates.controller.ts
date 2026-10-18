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
import type { PaginatedResponse, Template } from '@tomato/types';
import { PaginationQueryDto } from '../../common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplatesService } from './templates.service';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'List templates' })
  list(@Query() query: PaginationQueryDto): Promise<PaginatedResponse<Template>> {
    return this.templatesService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a template' })
  @ApiParam(ID_PARAM)
  get(@Param('id', ParseUUIDPipe) id: string): Promise<Template> {
    return this.templatesService.get(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a template' })
  create(@Body() dto: CreateTemplateDto): Promise<Template> {
    return this.templatesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a template' })
  @ApiParam(ID_PARAM)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTemplateDto,
  ): Promise<Template> {
    return this.templatesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a template' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.templatesService.remove(id);
  }
}
