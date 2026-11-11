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
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import type { Folder } from '../../generated/prisma/client';
import { FoldersService } from './folders.service';
import type { FolderDetailEntity, FolderTree } from './folders.types';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a folder' })
  create(@Body() dto: CreateFolderDto): Promise<Folder> {
    return this.foldersService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a folder with its direct subfolders and files' })
  @ApiParam(ID_PARAM)
  get(@Param('id', ParseUUIDPipe) id: string): Promise<FolderDetailEntity> {
    return this.foldersService.get(id);
  }

  @Get(':id/tree')
  @ApiOperation({ summary: 'Get every folder and file under a folder, itself included' })
  @ApiParam(ID_PARAM)
  getTree(@Param('id', ParseUUIDPipe) id: string): Promise<FolderTree> {
    return this.foldersService.getTree(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rename a folder or move it inside its group' })
  @ApiParam(ID_PARAM)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFolderDto): Promise<Folder> {
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
