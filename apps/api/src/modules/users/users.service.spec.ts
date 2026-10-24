import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import type { User as UserEntity } from '../../generated/prisma/client';
import type { DepartmentsService } from '../departments/departments.service';
import type { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

const DEPARTMENT_ID = 'b1d2c3e4-0a1b-4c2d-8e3f-1a2b3c4d5e6f';
const OTHER_DEPARTMENT_ID = 'c2e3d4f5-1b2c-4d3e-9f40-2b3c4d5e6f70';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';

function makeEntity(id: string, departmentId: string, name: string, email: string): UserEntity {
  const now = new Date();
  return { id, departmentId, name, email, createdAt: now, updatedAt: now };
}

class FakeRepository {
  readonly store = new Map<string, UserEntity>();

  async findMany(departmentId: string) {
    const items = [...this.store.values()].filter((entity) => entity.departmentId === departmentId);
    return { items, total: items.length };
  }
  async findById(departmentId: string, id: string) {
    const entity = this.store.get(id);
    return entity?.departmentId === departmentId ? entity : null;
  }
  async create(departmentId: string, data: { name: string; email: string }) {
    const entity = makeEntity(crypto.randomUUID(), departmentId, data.name, data.email);
    this.store.set(entity.id, entity);
    return entity;
  }
  async update(departmentId: string, id: string, data: { name?: string; email?: string }) {
    const current = await this.findById(departmentId, id);
    if (!current) return null;
    const next = makeEntity(id, departmentId, data.name ?? current.name, data.email ?? current.email);
    this.store.set(id, next);
    return next;
  }
  async delete(departmentId: string, id: string) {
    return (await this.findById(departmentId, id)) ? this.store.delete(id) : false;
  }
}

class FakeDepartmentsService {
  async get(id: string) {
    if (id === MISSING_ID) throw new NotFoundException();
  }
}

describe('UsersService', () => {
  let repository: FakeRepository;
  let service: UsersService;

  beforeEach(() => {
    repository = new FakeRepository();
    service = new UsersService(
      repository as unknown as UsersRepository,
      new FakeDepartmentsService() as unknown as DepartmentsService,
    );
  });

  it('creates and lists users of a department only', async () => {
    const created = await service.create(DEPARTMENT_ID, { name: 'Ann', email: 'ann@example.com' });
    await service.create(OTHER_DEPARTMENT_ID, { name: 'Bob', email: 'bob@example.com' });
    const page = await service.list(DEPARTMENT_ID, { page: 1, pageSize: 20 });
    expect(page).toMatchObject({ total: 1, page: 1, pageSize: 20 });
    expect(page.items[0]).toMatchObject({ id: created.id, departmentId: DEPARTMENT_ID, email: 'ann@example.com' });
  });

  it('throws when the department is unknown', async () => {
    await expect(service.list(MISSING_ID, { page: 1, pageSize: 20 })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.create(MISSING_ID, { name: 'Ann', email: 'ann@example.com' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('gets a user and throws for an unknown id or another department', async () => {
    const created = await service.create(DEPARTMENT_ID, { name: 'Ann', email: 'ann@example.com' });
    await expect(service.get(DEPARTMENT_ID, created.id)).resolves.toMatchObject({ name: 'Ann' });
    await expect(service.get(DEPARTMENT_ID, MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.get(OTHER_DEPARTMENT_ID, created.id)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates a user and throws for an unknown id', async () => {
    const created = await service.create(DEPARTMENT_ID, { name: 'Ann', email: 'ann@example.com' });
    await expect(service.update(DEPARTMENT_ID, created.id, { name: 'Anna' })).resolves.toMatchObject({
      name: 'Anna',
      email: 'ann@example.com',
    });
    await expect(service.update(DEPARTMENT_ID, MISSING_ID, { name: 'Anna' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('removes a user and throws for an unknown id', async () => {
    const created = await service.create(DEPARTMENT_ID, { name: 'Ann', email: 'ann@example.com' });
    await service.remove(DEPARTMENT_ID, created.id);
    expect(repository.store.size).toBe(0);
    await expect(service.remove(DEPARTMENT_ID, created.id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
