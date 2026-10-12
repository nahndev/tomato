import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  createTemplateSchema,
  paginationQuerySchema,
  templateIdSchema,
  updateTemplateSchema,
} from '@tomato/schemas';
import type { PaginationQuery } from '@tomato/schemas';
import type { PaginatedResponse, Template } from '@tomato/types';
import { ZodValidationPipe } from '../../common';
import type { CreateTemplateDto } from './dto/create-template.dto';
import type { UpdateTemplateDto } from './dto/update-template.dto';
import { TEMPLATES_ROUTE } from './templates.constants';
import { TemplatesService } from './templates.service';

@ApiTags(TEMPLATES_ROUTE)
@Controller(TEMPLATES_ROUTE)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: PaginationQuery,
  ): Promise<PaginatedResponse<Template>> {
    return this.templatesService.list(query);
  }

  @Get(':id')
  get(@Param('id', new ZodValidationPipe(templateIdSchema)) id: string): Promise<Template> {
    return this.templatesService.get(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(createTemplateSchema)) dto: CreateTemplateDto): Promise<Template> {
    return this.templatesService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', new ZodValidationPipe(templateIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateTemplateSchema)) dto: UpdateTemplateDto,
  ): Promise<Template> {
    return this.templatesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ZodValidationPipe(templateIdSchema)) id: string): Promise<void> {
    return this.templatesService.remove(id);
  }
}
