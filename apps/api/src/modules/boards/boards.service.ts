import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import type { Board, BoardColumn, BoardSummary, PaginatedResponse } from '@tomato/types';
import type { PaginationQueryDto } from '../../common';
import type { CreateBoardDto } from './dto/create-board.dto';
import type { UpdateBoardDto } from './dto/update-board.dto';
import { toBoard, toBoardSummary } from './boards.mapper';
import { BoardsRepository } from './boards.repository';

function pruneColumns(columns: BoardColumn[], templateIds: Set<string>): BoardColumn[] {
  return columns.map((column) => ({
    ...column,
    items: Object.fromEntries(Object.entries(column.items).filter(([id]) => templateIds.has(id))),
  }));
}

function hasUnlinkedItem(columns: BoardColumn[], templateIds: Set<string>): boolean {
  return columns.some((column) => Object.keys(column.items).some((id) => !templateIds.has(id)));
}

@Injectable()
export class BoardsService {
  constructor(private readonly repository: BoardsRepository) {}

  async list({ page, pageSize }: PaginationQueryDto): Promise<PaginatedResponse<BoardSummary>> {
    const { items, total } = await this.repository.findMany((page - 1) * pageSize, pageSize);
    return { items: items.map(toBoardSummary), total, page, pageSize };
  }

  async get(id: string): Promise<Board> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    return toBoard(entity);
  }

  async create(dto: CreateBoardDto): Promise<Board> {
    const templateIds = dto.templateIds ?? [];
    const columns = dto.columns ?? [];
    await this.assertTemplates(templateIds);
    this.assertColumnsLinked(columns, templateIds);
    return toBoard(await this.repository.create({ name: dto.name, columns, templateIds }));
  }

  async update(id: string, dto: UpdateBoardDto): Promise<Board> {
    const current = await this.repository.findById(id);
    if (!current) throw new NotFoundException();

    const templateIds = dto.templateIds ?? current.templates.map((link) => link.templateId);
    if (dto.templateIds) await this.assertTemplates(templateIds);

    let columns = dto.columns;
    if (columns) this.assertColumnsLinked(columns, templateIds);
    else if (dto.templateIds) {
      columns = pruneColumns(current.columns as unknown as BoardColumn[], new Set(templateIds));
    }

    const entity = await this.repository.update(id, {
      name: dto.name,
      columns,
      templateIds: dto.templateIds,
    });
    if (!entity) throw new NotFoundException();
    return toBoard(entity);
  }

  async remove(id: string): Promise<void> {
    if (!(await this.repository.delete(id))) throw new NotFoundException();
  }

  private async assertTemplates(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    if ((await this.repository.countTemplates(ids)) !== ids.length) {
      throw new BadRequestException({ details: { templateIds: [ErrorCode.NOT_FOUND] } });
    }
  }

  private assertColumnsLinked(columns: BoardColumn[], templateIds: string[]): void {
    if (hasUnlinkedItem(columns, new Set(templateIds))) {
      throw new BadRequestException({ details: { columns: [ErrorCode.VALIDATION_FAILED] } });
    }
  }
}
