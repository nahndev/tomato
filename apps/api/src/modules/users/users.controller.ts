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
  Put,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AVATAR_MAX_SIZE } from '@tomato/constants';
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

  @Put(':id/avatar')
  @ApiOperation({ summary: 'Upload the avatar of a user' })
  @ApiParam(ID_PARAM)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: AVATAR_MAX_SIZE } }))
  uploadAvatar(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file?: { buffer: Buffer },
  ): Promise<User> {
    return this.usersService.uploadAvatar(departmentId, id, file?.buffer);
  }

  @Get(':id/avatar')
  @ApiOperation({ summary: 'Get the avatar of a user' })
  @ApiParam(ID_PARAM)
  // Web requests it with the avatar key as a version, so each upload gets a new URL.
  @Header('Cache-Control', 'private, max-age=31536000, immutable')
  @Header('X-Content-Type-Options', 'nosniff')
  async getAvatar(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    const { content, type } = await this.usersService.getAvatar(departmentId, id);
    return new StreamableFile(content, { type });
  }
}
