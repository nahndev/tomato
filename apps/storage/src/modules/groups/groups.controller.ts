import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { PaginatedResponse } from '../../common';
import { ListGroupsQueryDto } from './dto/list-groups-query.dto';
import { GroupsService } from './groups.service';
import type { GroupWithRootFolder } from './groups.types';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: 'List groups with their root folder, optionally narrowed by a filter' })
  list(@Query() query: ListGroupsQueryDto): Promise<PaginatedResponse<GroupWithRootFolder>> {
    return this.groupsService.list(query);
  }
}
