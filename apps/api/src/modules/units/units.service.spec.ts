import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { ClientService } from './client.service';
import type { UnitEntity, UnitWriteData, UnitWriteResult, UnitsRepository } from './units.repository';
import { UnitsService } from './units.service';

const CLIENT_TYPE = { id: 'type-client', name: 'client', isDefault: true, createdAt: new Date(), updatedAt: new Date() };
const TEAM_TYPE = { id: 'type-team', name: 'team', isDefault: true, createdAt: new Date(), updatedAt: new Date() };
const TYPES = [CLIENT_TYPE, TEAM_TYPE];
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';

function makeEntity(id: string, name: string, typeId: string, isSystem = false): UnitEntity {
  const now = new Date();
  const type = TYPES.find((candidate) => candidate.id === typeId)!;
  return { id, name, isSystem, typeId, type, createdAt: now, updatedAt: now };
}

class FakeRepository {
  readonly store = new Map<string, UnitEntity>([
    ['system', makeEntity('system', 'Client', CLIENT_TYPE.id, true)],
  ]);

  async findMany() {
    return { items: [...this.store.values()], total: this.store.size };
  }
  async findById(id: string) {
    return this.store.get(id) ?? null;
  }
  async findSystem() {
    return [...this.store.values()].find((unit) => unit.isSystem) ?? null;
  }
  async create(data: { name: string; typeId: string }): Promise<UnitWriteResult> {
    if (!TYPES.some((type) => type.id === data.typeId)) return { error: 'unknown-type' };
    const entity = makeEntity(crypto.randomUUID(), data.name, data.typeId);
    this.store.set(entity.id, entity);
    return { entity };
  }
  async update(id: string, data: UnitWriteData): Promise<UnitWriteResult> {
    const current = this.store.get(id);
    if (!current) return { error: 'not-found' };
    const next = makeEntity(id, data.name ?? current.name, data.typeId ?? current.typeId, current.isSystem);
    this.store.set(id, next);
    return { entity: next };
  }
  async delete(id: string) {
    return this.store.delete(id);
  }
}

describe('UnitsService', () => {
  let repository: FakeRepository;
  let service: UnitsService;

  beforeEach(() => {
    repository = new FakeRepository();
    service = new UnitsService(repository as unknown as UnitsRepository);
  });

  it('creates and reads a unit with its type', async () => {
    const created = await service.create({ name: 'Sales', typeId: TEAM_TYPE.id });

    expect(created.isSystem).toBe(false);
    expect(created.type.name).toBe('team');
    expect((await service.get(created.id)).name).toBe('Sales');
  });

  it('rejects an unknown type', async () => {
    await expect(service.create({ name: 'Sales', typeId: MISSING_ID })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates the name of a unit', async () => {
    const created = await service.create({ name: 'Sales', typeId: TEAM_TYPE.id });

    expect((await service.update(created.id, { name: 'Support' })).name).toBe('Support');
  });

  it('lets the system unit be renamed but not retyped or deleted', async () => {
    expect((await service.update('system', { name: 'Acme' })).name).toBe('Acme');
    await expect(service.update('system', { typeId: TEAM_TYPE.id })).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.remove('system')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('deletes a unit', async () => {
    const created = await service.create({ name: 'Sales', typeId: TEAM_TYPE.id });

    await service.remove(created.id);

    await expect(service.get(created.id)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws NotFound for an unknown unit', async () => {
    await expect(service.get(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.update(MISSING_ID, { name: 'A' })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('ClientService', () => {
  it('loads the system unit', async () => {
    const client = new ClientService(new FakeRepository() as unknown as UnitsRepository);

    const unit = await client.load();

    expect(unit.isSystem).toBe(true);
    expect(unit.type.name).toBe('client');
  });
});
