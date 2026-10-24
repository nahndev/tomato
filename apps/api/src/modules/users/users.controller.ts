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
import type { PaginatedResponse, User } from '@tomato/types';
import { PaginationQueryDto } from '../../common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

const DEPARTMENT_ID_PARAM = { name: 'departmentId', format: 'uuid' };
const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('users')
@ApiParam(DEPARTMENT_ID_PARAM)
@Controller('departments/:departmentId/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users of a department' })
  list(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<User>> {
    return this.usersService.list(departmentId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user' })
  @ApiParam(ID_PARAM)
  get(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.get(departmentId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a user in a department' })
  create(@Param('departmentId', ParseUUIDPipe) departmentId: string, @Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(departmentId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam(ID_PARAM)
  update(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(departmentId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.usersService.remove(departmentId, id);
  }
}
