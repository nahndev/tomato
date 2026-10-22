import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import type { UnitType as UnitTypeModel } from '../../generated/prisma/client';
import type { UnitTypeDeleteResult, UnitTypesRepository } from './unit-types.repository';
import { UnitTypesService } from './unit-types.service';

const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';
const DEFAULT_ID = 'default';

const makeType = (id: string, name: string, isDefault = false): UnitTypeModel => ({
  id,
  name,
  isDefault,
  createdAt: new Date(),
  updatedAt: new Date(),
});

class FakeRepository {
  readonly store = new Map<string, UnitTypeModel>([[DEFAULT_ID, makeType(DEFAULT_ID, 'client', true)]]);
  readonly usedIds = new Set<string>();

  async findAll() {
    return [...this.store.values()];
  }
  async findById(id: string) {
    return this.store.get(id) ?? null;
  }
  async create(name: string) {
    const type = makeType(crypto.randomUUID(), name);
    this.store.set(type.id, type);
    return type;
  }
  async update(id: string, name: string) {
    const current = this.store.get(id);
    if (!current) return null;
    const next = { ...current, name };
    this.store.set(id, next);
    return next;
  }
  async delete(id: string): Promise<UnitTypeDeleteResult> {
    if (!this.store.has(id)) return 'not-found';
    if (this.usedIds.has(id)) return 'in-use';
    this.store.delete(id);
    return 'deleted';
  }
}

describe('UnitTypesService', () => {
  let repository: FakeRepository;
  let service: UnitTypesService;

  beforeEach(() => {
    repository = new FakeRepository();
    service = new UnitTypesService(repository as unknown as UnitTypesRepository);
  });

  it('creates, renames and deletes a custom type', async () => {
    const created = await service.create({ name: 'branch' });
    expect(created.isDefault).toBe(false);

    expect((await service.update(created.id, { name: 'region' })).name).toBe('region');

    await service.remove(created.id);
    expect(await service.list()).toHaveLength(1);
  });

  it('locks the default types', async () => {
    await expect(service.update(DEFAULT_ID, { name: 'other' })).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.remove(DEFAULT_ID)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('refuses to delete a type that units still use', async () => {
    const created = await service.create({ name: 'branch' });
    repository.usedIds.add(created.id);

    await expect(service.remove(created.id)).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws NotFound for an unknown type', async () => {
    await expect(service.update(MISSING_ID, { name: 'a' })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
  });
});
