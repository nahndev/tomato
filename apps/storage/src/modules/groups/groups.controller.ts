import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { PaginatedResponse, StorageGroup } from '@tomato/types';
import { ListGroupsQueryDto } from './dto/list-groups-query.dto';
import { GroupsService } from './groups.service';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: 'List groups with their root folder, optionally by type and uuid' })
  list(@Query() query: ListGroupsQueryDto): Promise<PaginatedResponse<StorageGroup>> {
    return this.groupsService.list(query);
  }
}
