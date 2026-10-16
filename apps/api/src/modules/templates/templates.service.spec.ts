import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Template as TemplateModel } from '../../generated/prisma/client';
import type { TemplatesRepository } from './templates.repository';
import { TemplatesService } from './templates.service';

const MISSING_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';

class FakeTemplatesRepository {
  private readonly store = new Map<string, TemplateModel>();

  async findMany(skip: number, take: number) {
    const all = [...this.store.values()].reverse();
    return { items: all.slice(skip, skip + take), total: all.length };
  }

  async findById(id: string) {
    return this.store.get(id) ?? null;
  }

  async create(data: { name: string; description?: string; previewImageUrl?: string }) {
    const now = new Date();
    const entity: TemplateModel = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description ?? null,
      previewImageUrl: data.previewImageUrl ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(entity.id, entity);
    return entity;
  }

  async update(id: string, data: { name?: string; description?: string }) {
    const current = this.store.get(id);
    if (!current) return null;
    const next = { ...current, ...data, updatedAt: new Date() };
    this.store.set(id, next);
    return next;
  }

  async delete(id: string) {
    return this.store.delete(id);
  }
}

describe('TemplatesService', () => {
  let service: TemplatesService;

  beforeEach(() => {
    service = new TemplatesService(new FakeTemplatesRepository() as unknown as TemplatesRepository);
  });

  it('creates and returns a template with ISO dates', async () => {
    const template = await service.create({ name: 'Survey' });
    expect(template).toMatchObject({ name: 'Survey', description: null });
    expect(new Date(template.createdAt).toISOString()).toBe(template.createdAt);
    expect(await service.get(template.id)).toEqual(template);
  });

  it('lists newest first with pagination', async () => {
    const first = await service.create({ name: 'A' });
    const second = await service.create({ name: 'B' });
    await service.create({ name: 'C' });

    const page = await service.list({ page: 2, pageSize: 2 });
    expect(page.total).toBe(3);
    expect(page.items).toHaveLength(1);
    expect(page.items[0]).toEqual(first);
    expect((await service.list({ page: 1, pageSize: 3 })).items.map((t) => t.id)).toContain(second.id);
  });

  it('updates only the provided fields', async () => {
    const { id } = await service.create({ name: 'A', description: 'desc' });
    const updated = await service.update(id, { name: 'B' });
    expect(updated).toMatchObject({ name: 'B', description: 'desc' });
  });

  it('removes a template', async () => {
    const { id } = await service.create({ name: 'A' });
    await service.remove(id);
    await expect(service.get(id)).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException for a missing id', async () => {
    await expect(service.get(MISSING_ID)).rejects.toThrow(NotFoundException);
    await expect(service.update(MISSING_ID, { name: 'x' })).rejects.toThrow(NotFoundException);
    await expect(service.remove(MISSING_ID)).rejects.toThrow(NotFoundException);
  });
});
