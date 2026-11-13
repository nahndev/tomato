import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { PaginatedResponse } from '../../common';
import { ListAllUsersQueryDto } from './dto/list-all-users-query.dto';
import { UsersService } from './users.service';
import type { UserWithRelations } from './users.types';

@ApiTags('users')
@Controller('users')
export class UsersDirectoryController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users of every department, or of one with `departmentId`' })
  list(@Query() query: ListAllUsersQueryDto): Promise<PaginatedResponse<UserWithRelations>> {
    return this.usersService.listAll(query);
  }
}
