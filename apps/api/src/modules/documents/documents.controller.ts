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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUuidParam } from '../../common';
import type { PaginatedResponse } from '../../common';
import type { Document } from '../../generated/prisma/client';
import { PaginationQueryDto } from '../../common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentsService } from './documents.service';

@ApiTags('documents')
@ApiUuidParam('departmentId')
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
  @ApiUuidParam()
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
  @ApiUuidParam()
  update(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDocumentDto,
  ): Promise<Document> {
    return this.documentsService.update(departmentId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiUuidParam()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.documentsService.remove(departmentId, id);
  }
}
