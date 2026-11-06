import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { STORAGE_FILE_MAX_SIZE } from '@tomato/constants';
import type { StorageFile } from '@tomato/types';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FILE_DOWNLOAD_DISPOSITION, FILE_UPLOAD_FIELD } from './files.constants';
import { FilesService } from './files.service';
import type { UploadedStorageFile } from './files.types';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a file into a folder' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folderId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @UseInterceptors(
    // Browsers send the filename as raw UTF-8; multer would read it as latin1.
    FileInterceptor(FILE_UPLOAD_FIELD, { limits: { fileSize: STORAGE_FILE_MAX_SIZE }, defParamCharset: 'utf8' }),
  )
  create(@Body() dto: CreateFileDto, @UploadedFile() file?: UploadedStorageFile): Promise<StorageFile> {
    return this.filesService.create(dto.folderId, file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a file' })
  @ApiParam(ID_PARAM)
  get(@Param('id', ParseUUIDPipe) id: string): Promise<StorageFile> {
    return this.filesService.get(id);
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Download the content of a file' })
  @ApiParam(ID_PARAM)
  // Served from the web origin: uploaded HTML or SVG must never render inline.
  @Header('X-Content-Type-Options', 'nosniff')
  async getContent(@Param('id', ParseUUIDPipe) id: string): Promise<StreamableFile> {
    const { content, name, mimeType } = await this.filesService.getContent(id);
    return new StreamableFile(content, {
      type: mimeType,
      disposition: `${FILE_DOWNLOAD_DISPOSITION}; filename*=UTF-8''${encodeURIComponent(name)}`,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rename a file or move it to another folder of its group' })
  @ApiParam(ID_PARAM)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFileDto): Promise<StorageFile> {
    return this.filesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.filesService.remove(id);
  }
}
