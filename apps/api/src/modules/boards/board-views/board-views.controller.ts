import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseEnumPipe, ParseUUIDPipe, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BoardView } from '@tomato/constants';
import type { BoardEntity } from '../boards.types';
import { BoardViewsService } from './board-views.service';
import { SaveBoardTableDto } from './dto/save-board-table.dto';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('boards')
@Controller('boards/:id/views')
export class BoardViewsController {
  constructor(private readonly boardViewsService: BoardViewsService) {}

  @Put('table')
  @ApiOperation({ summary: 'Add or update the table view of a board' })
  @ApiParam(ID_PARAM)
  saveTable(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SaveBoardTableDto): Promise<BoardEntity> {
    return this.boardViewsService.saveTable(id, dto);
  }

  @Put('task')
  @ApiOperation({ summary: 'Add the task view to a board' })
  @ApiParam(ID_PARAM)
  addTask(@Param('id', ParseUUIDPipe) id: string): Promise<BoardEntity> {
    return this.boardViewsService.add(id, BoardView.TASK);
  }

  @Put('agenda')
  @ApiOperation({ summary: 'Add the agenda view to a board' })
  @ApiParam(ID_PARAM)
  addAgenda(@Param('id', ParseUUIDPipe) id: string): Promise<BoardEntity> {
    return this.boardViewsService.add(id, BoardView.AGENDA);
  }

  @Delete(':view')
  @ApiOperation({ summary: 'Remove a view from a board' })
  @ApiParam(ID_PARAM)
  @ApiParam({ name: 'view', enum: Object.values(BoardView) })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('view', new ParseEnumPipe(BoardView)) view: BoardView,
  ): Promise<void> {
    return this.boardViewsService.remove(id, view);
  }
}
