import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Unit } from '@tomato/types';
import { toUnit } from './units.mapper';
import { UnitsRepository } from './units.repository';

@Injectable()
export class ClientService {
  constructor(private readonly repository: UnitsRepository) {}

  /** The system unit: the client every other unit belongs to. */
  async load(): Promise<Unit> {
    const entity = await this.repository.findSystem();
    if (!entity) throw new InternalServerErrorException();
    return toUnit(entity);
  }
}
