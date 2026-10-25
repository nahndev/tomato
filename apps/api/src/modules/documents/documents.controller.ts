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
import type { Document, PaginatedResponse } from '@tomato/types';
import { PaginationQueryDto } from '../../common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentsService } from './documents.service';

const DEPARTMENT_ID_PARAM = { name: 'departmentId', format: 'uuid' };
const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('documents')
@ApiParam(DEPARTMENT_ID_PARAM)
@Controller('departments/:departmentId/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'List documents of a department' })
  list(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<Document>> {
    return this.documentsService.list(departmentId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document' })
  @ApiParam(ID_PARAM)
  get(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Document> {
    return this.documentsService.get(departmentId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a document in a department' })
  create(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Body() dto: CreateDocumentDto,
  ): Promise<Document> {
    return this.documentsService.create(departmentId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a document' })
  @ApiParam(ID_PARAM)
  update(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDocumentDto,
  ): Promise<Document> {
    return this.documentsService.update(departmentId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.documentsService.remove(departmentId, id);
  }
}
