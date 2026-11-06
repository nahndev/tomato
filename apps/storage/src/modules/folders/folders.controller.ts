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
import type { StorageFolder, StorageFolderDetail } from '@tomato/types';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FoldersService } from './folders.service';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a folder' })
  create(@Body() dto: CreateFolderDto): Promise<StorageFolder> {
    return this.foldersService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a folder with its direct subfolders and files' })
  @ApiParam(ID_PARAM)
  get(@Param('id', ParseUUIDPipe) id: string): Promise<StorageFolderDetail> {
    return this.foldersService.get(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rename a folder or move it inside its group' })
  @ApiParam(ID_PARAM)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFolderDto): Promise<StorageFolder> {
    return this.foldersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a folder with everything inside it' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.foldersService.remove(id);
  }
}
