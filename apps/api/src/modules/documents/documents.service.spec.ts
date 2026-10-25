import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Document as DocumentEntity } from '../../generated/prisma/client';
import type { DepartmentsService } from '../departments/departments.service';
import type { UsersService } from '../users/users.service';
import type { DocumentsRepository } from './documents.repository';
import { DocumentsService } from './documents.service';

const DEPARTMENT_ID = 'b1d2c3e4-0a1b-4c2d-8e3f-1a2b3c4d5e6f';
const OTHER_DEPARTMENT_ID = 'c2e3d4f5-1b2c-4d3e-9f40-2b3c4d5e6f70';
const OWNER_ID = 'd3f4e5a6-2c3d-4e4f-a051-3c4d5e6f7081';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';

function makeEntity(
  id: string,
  departmentId: string,
  data: { title: string; content?: string; ownerId: string },
): DocumentEntity {
  const now = new Date();
  return { id, departmentId, content: '', ...data, createdAt: now, updatedAt: now };
}

class FakeRepository {
  readonly store = new Map<string, DocumentEntity>();

  async findMany(departmentId: string) {
    const items = [...this.store.values()].filter((entity) => entity.departmentId === departmentId);
    return { items, total: items.length };
  }
  async findById(departmentId: string, id: string) {
    const entity = this.store.get(id);
    return entity?.departmentId === departmentId ? entity : null;
  }
  async create(departmentId: string, data: { title: string; content?: string; ownerId: string }) {
    const entity = makeEntity(crypto.randomUUID(), departmentId, data);
    this.store.set(entity.id, entity);
    return entity;
  }
  async update(departmentId: string, id: string, data: { title?: string; content?: string }) {
    const current = await this.findById(departmentId, id);
    if (!current) return null;
    const next = { ...current, title: data.title ?? current.title, content: data.content ?? current.content };
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

class FakeUsersService {
  async get(departmentId: string, id: string) {
    if (departmentId !== DEPARTMENT_ID || id !== OWNER_ID) throw new NotFoundException();
  }
}

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeEach(() => {
    service = new DocumentsService(
      new FakeRepository() as unknown as DocumentsRepository,
      new FakeDepartmentsService() as unknown as DepartmentsService,
      new FakeUsersService() as unknown as UsersService,
    );
  });

  it('creates and lists documents of a department only', async () => {
    const created = await service.create(DEPARTMENT_ID, { title: 'Guide', content: 'Hello', ownerId: OWNER_ID });
    const page = await service.list(DEPARTMENT_ID, { page: 1, pageSize: 20 });
    expect(page).toMatchObject({ total: 1, page: 1, pageSize: 20 });
    expect(page.items[0]).toMatchObject({ id: created.id, title: 'Guide', content: 'Hello', ownerId: OWNER_ID });
    expect((await service.list(OTHER_DEPARTMENT_ID, { page: 1, pageSize: 20 })).total).toBe(0);
  });

  it('rejects an owner outside the department', async () => {
    await expect(
      service.create(OTHER_DEPARTMENT_ID, { title: 'Guide', ownerId: OWNER_ID }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects an unknown department', async () => {
    await expect(service.create(MISSING_ID, { title: 'Guide', ownerId: OWNER_ID })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(service.list(MISSING_ID, { page: 1, pageSize: 20 })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('gets a document only within its department', async () => {
    const created = await service.create(DEPARTMENT_ID, { title: 'Guide', ownerId: OWNER_ID });
    expect((await service.get(DEPARTMENT_ID, created.id)).title).toBe('Guide');
    await expect(service.get(OTHER_DEPARTMENT_ID, created.id)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates title and content', async () => {
    const created = await service.create(DEPARTMENT_ID, { title: 'Guide', ownerId: OWNER_ID });
    const updated = await service.update(DEPARTMENT_ID, created.id, { content: 'Body' });
    expect(updated).toMatchObject({ title: 'Guide', content: 'Body' });
    await expect(service.update(DEPARTMENT_ID, MISSING_ID, { title: 'X' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('removes a document', async () => {
    const created = await service.create(DEPARTMENT_ID, { title: 'Guide', ownerId: OWNER_ID });
    await service.remove(DEPARTMENT_ID, created.id);
    await expect(service.get(DEPARTMENT_ID, created.id)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(DEPARTMENT_ID, created.id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
