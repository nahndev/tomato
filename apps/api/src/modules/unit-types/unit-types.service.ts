import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { UnitType } from '@tomato/types';
import { PrismaErrorCode, isPrismaError } from '../../common';
import type { CreateUnitTypeDto } from './dto/create-unit-type.dto';
import type { UpdateUnitTypeDto } from './dto/update-unit-type.dto';
import { toUnitType } from './unit-types.mapper';
import { UnitTypesRepository } from './unit-types.repository';

@Injectable()
export class UnitTypesService {
  constructor(private readonly repository: UnitTypesRepository) {}

  async list(): Promise<UnitType[]> {
    return (await this.repository.findAll()).map(toUnitType);
  }

  async create(dto: CreateUnitTypeDto): Promise<UnitType> {
    try {
      return toUnitType(await this.repository.create(dto.name));
    } catch (error) {
      throw this.mapNameConflict(error);
    }
  }

  async update(id: string, dto: UpdateUnitTypeDto): Promise<UnitType> {
    const current = await this.repository.findById(id);
    if (!current) throw new NotFoundException();
    if (current.isDefault) throw new ForbiddenException();
    if (dto.name === undefined) return toUnitType(current);

    try {
      const entity = await this.repository.update(id, dto.name);
      if (!entity) throw new NotFoundException();
      return toUnitType(entity);
    } catch (error) {
      throw this.mapNameConflict(error);
    }
  }

  async remove(id: string): Promise<void> {
    const current = await this.repository.findById(id);
    if (!current) throw new NotFoundException();
    if (current.isDefault) throw new ForbiddenException();

    const result = await this.repository.delete(id);
    if (result === 'not-found') throw new NotFoundException();
    if (result === 'in-use') throw new ConflictException();
  }

  private mapNameConflict(error: unknown): unknown {
    return isPrismaError(error, PrismaErrorCode.UNIQUE_VIOLATION) ? new ConflictException() : error;
  }
}
