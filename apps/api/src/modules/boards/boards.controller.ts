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
import type { PaginatedResponse } from '../../common';
import { PaginationQueryDto } from '../../common';
import { BOARDS_ROUTE } from './boards.constants';
import { BoardsService } from './boards.service';
import type { BoardEntity, BoardListEntity } from './boards.types';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('boards')
@Controller(BOARDS_ROUTE)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @ApiOperation({ summary: 'List boards' })
  list(@Query() query: PaginationQueryDto): Promise<PaginatedResponse<BoardListEntity>> {
    return this.boardsService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a board with its linked template versions' })
  @ApiParam(ID_PARAM)
  get(@Param('id', ParseUUIDPipe) id: string): Promise<BoardEntity> {
    return this.boardsService.get(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a board' })
  create(@Body() dto: CreateBoardDto): Promise<BoardEntity> {
    return this.boardsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a board' })
  @ApiParam(ID_PARAM)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBoardDto): Promise<BoardEntity> {
    return this.boardsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a board and its submissions' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.boardsService.remove(id);
  }
}
