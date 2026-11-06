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
import type { PaginatedResponse, StorageGroup, StorageGroupDetail } from '@tomato/types';
import { CreateGroupDto } from './dto/create-group.dto';
import { ListGroupsQueryDto } from './dto/list-groups-query.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupsService } from './groups.service';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: 'List groups, optionally by type and uuid' })
  list(@Query() query: ListGroupsQueryDto): Promise<PaginatedResponse<StorageGroup>> {
    return this.groupsService.list(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a group with its root folder' })
  create(@Body() dto: CreateGroupDto): Promise<StorageGroup> {
    return this.groupsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group with all its folders and files' })
  @ApiParam(ID_PARAM)
  get(@Param('id', ParseUUIDPipe) id: string): Promise<StorageGroupDetail> {
    return this.groupsService.get(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a group' })
  @ApiParam(ID_PARAM)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateGroupDto): Promise<StorageGroup> {
    return this.groupsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a group with all its folders and files' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.groupsService.remove(id);
  }
}
