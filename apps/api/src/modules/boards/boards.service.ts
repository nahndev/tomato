import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import type { BoardColumn } from './boards.types';
import type { PaginatedResponse } from '../../common';
import type { PaginationQueryDto } from '../../common';
import type { CreateBoardDto } from './dto/create-board.dto';
import type { UpdateBoardDto } from './dto/update-board.dto';
import { BoardsRepository } from './boards.repository';
import type { BoardEntity, BoardListEntity } from './boards.types';

function pruneColumns(columns: BoardColumn[], templateIds: Set<string>): BoardColumn[] {
  return columns.map((column) => ({
    ...column,
    items: Object.fromEntries(Object.entries(column.items).filter(([id]) => templateIds.has(id))),
  }));
}

@Injectable()
export class BoardsService {
  constructor(private readonly repository: BoardsRepository) {}

  async list({ page, pageSize }: PaginationQueryDto): Promise<PaginatedResponse<BoardListEntity>> {
    const { items, total } = await this.repository.findMany((page - 1) * pageSize, pageSize);
    return { items, total, page, pageSize };
  }

  async get(id: string): Promise<BoardEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create(dto: CreateBoardDto): Promise<BoardEntity> {
    const templateIds = dto.templateIds ?? [];
    await this.assertTemplates(templateIds);
    return this.repository.create({ name: dto.name, templateIds });
  }

  async update(id: string, dto: UpdateBoardDto): Promise<BoardEntity> {
    const current = await this.repository.findById(id);
    if (!current) throw new NotFoundException();

    if (dto.templateIds) await this.assertTemplates(dto.templateIds);
    const columns =
      dto.templateIds && current.table ? pruneColumns(current.table.columns, new Set(dto.templateIds)) : undefined;

    const entity = await this.repository.update(id, {
      name: dto.name,
      templateIds: dto.templateIds,
      columns,
    });
    if (!entity) throw new NotFoundException();
    return entity;
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
}
