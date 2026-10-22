import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import type { PaginatedResponse, Unit } from '@tomato/types';
import type { PaginationQueryDto } from '../../common';
import type { CreateUnitDto } from './dto/create-unit.dto';
import type { UpdateUnitDto } from './dto/update-unit.dto';
import { toUnit } from './units.mapper';
import { UnitsRepository, type UnitWriteResult } from './units.repository';

@Injectable()
export class UnitsService {
  constructor(private readonly repository: UnitsRepository) {}

  async list({ page, pageSize }: PaginationQueryDto): Promise<PaginatedResponse<Unit>> {
    const { items, total } = await this.repository.findMany((page - 1) * pageSize, pageSize);
    return { items: items.map(toUnit), total, page, pageSize };
  }

  async get(id: string): Promise<Unit> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    return toUnit(entity);
  }

  async create(dto: CreateUnitDto): Promise<Unit> {
    return this.unwrap(await this.repository.create({ name: dto.name, typeId: dto.typeId }));
  }

  async update(id: string, dto: UpdateUnitDto): Promise<Unit> {
    const current = await this.repository.findById(id);
    if (!current) throw new NotFoundException();
    if (current.isSystem && dto.typeId !== undefined && dto.typeId !== current.typeId) {
      throw new ForbiddenException();
    }
    return this.unwrap(await this.repository.update(id, { name: dto.name, typeId: dto.typeId }));
  }

  async remove(id: string): Promise<void> {
    const current = await this.repository.findById(id);
    if (!current) throw new NotFoundException();
    if (current.isSystem) throw new ForbiddenException();
    if (!(await this.repository.delete(id))) throw new NotFoundException();
  }

  private unwrap(result: UnitWriteResult): Unit {
    if ('entity' in result) return toUnit(result.entity);
    if (result.error === 'not-found') throw new NotFoundException();
    throw new BadRequestException({ details: { typeId: [ErrorCode.NOT_FOUND] } });
  }
}
