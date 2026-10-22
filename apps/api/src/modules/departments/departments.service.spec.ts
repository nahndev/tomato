import { NotFoundException } from '@nestjs/common';
import type { Department as DepartmentEntity } from '../../generated/prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';
import type { DepartmentsRepository } from './departments.repository';
import { DepartmentsService } from './departments.service';

const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';

function makeEntity(id: string, name: string): DepartmentEntity {
  const now = new Date();
  return { id, name, createdAt: now, updatedAt: now };
}

class FakeRepository {
  readonly store = new Map<string, DepartmentEntity>();

  async findMany() {
    return { items: [...this.store.values()], total: this.store.size };
  }
  async findById(id: string) {
    return this.store.get(id) ?? null;
  }
  async create(data: { name: string }) {
    const entity = makeEntity(crypto.randomUUID(), data.name);
    this.store.set(entity.id, entity);
    return entity;
  }
  async update(id: string, data: { name?: string }) {
    const current = this.store.get(id);
    if (!current) return null;
    const next = makeEntity(id, data.name ?? current.name);
    this.store.set(id, next);
    return next;
  }
  async delete(id: string) {
    return this.store.delete(id);
  }
}

describe('DepartmentsService', () => {
  let repository: FakeRepository;
  let service: DepartmentsService;

  beforeEach(() => {
    repository = new FakeRepository();
    service = new DepartmentsService(repository as unknown as DepartmentsRepository);
  });

  it('creates and lists departments', async () => {
    const created = await service.create({ name: 'Sales' });
    const page = await service.list({ page: 1, pageSize: 20 });
    expect(page).toMatchObject({ total: 1, page: 1, pageSize: 20 });
    expect(page.items[0]).toMatchObject({ id: created.id, name: 'Sales' });
  });

  it('gets a department and throws for an unknown id', async () => {
    const created = await service.create({ name: 'Sales' });
    await expect(service.get(created.id)).resolves.toMatchObject({ name: 'Sales' });
    await expect(service.get(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('renames a department and throws for an unknown id', async () => {
    const created = await service.create({ name: 'Sales' });
    await expect(service.update(created.id, { name: 'Support' })).resolves.toMatchObject({ name: 'Support' });
    await expect(service.update(MISSING_ID, { name: 'Support' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('removes a department and throws for an unknown id', async () => {
    const created = await service.create({ name: 'Sales' });
    await service.remove(created.id);
    expect(repository.store.size).toBe(0);
    await expect(service.remove(created.id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
