import { BadRequestException, NotFoundException, PayloadTooLargeException } from '@nestjs/common';
import { MAP_IMAGE_MAX_SIZE } from '@tomato/constants';
import type { MapValue } from '@tomato/types';
import { beforeEach, describe, expect, it } from 'vitest';
import type { StorageFileClient } from '../../common';
import type { DepartmentMap as DepartmentMapEntity } from '../../generated/prisma/client';
import type { DepartmentsService } from '../departments/departments.service';
import type { MapValueDto } from './dto/map-value.dto';
import { EMPTY_MAP_VALUE } from './maps.constants';
import type { MapsRepository } from './maps.repository';
import { MapsService } from './maps.service';

const DEPARTMENT_ID = 'b1d2c3e4-0a1b-4c2d-8e3f-1a2b3c4d5e6f';
const OTHER_DEPARTMENT_ID = 'c2e3d4f5-1b2c-4d3e-9f40-2b3c4d5e6f70';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';
const PNG_FILE_ID = 'e4a5f6b7-3d4e-4f50-b162-4d5e6f708192';
const TEXT_FILE_ID = 'f5b6a7c8-4e5f-4061-8273-5e6f708192a3';
const LARGE_FILE_ID = 'a6c7b8d9-5f60-4172-9384-6f708192a3b4';

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
const FILES: Record<string, Buffer> = {
  [PNG_FILE_ID]: PNG,
  [TEXT_FILE_ID]: Buffer.from('hello'),
  [LARGE_FILE_ID]: Buffer.concat([PNG, Buffer.alloc(MAP_IMAGE_MAX_SIZE)]),
};

function valueWithImage(fileId: string): MapValueDto {
  return {
    layers: [
      { type: 'image', id: 'image-1', fileId, x: 0, y: 0, width: 1, height: 1 },
      { type: 'pin', id: 'pin-1', label: 'Entrance', description: '', x: 0.25, y: 0.5 },
    ],
    viewport: { transform: { x: 10, y: 20, scale: 2 } },
  } as MapValueDto;
}

class FakeRepository {
  readonly maps = new Map<string, DepartmentMapEntity>();

  async findMany(departmentId: string) {
    const items = [...this.maps.values()].filter((map) => map.departmentId === departmentId);
    return { items, total: items.length };
  }
  async findById(id: string) {
    return this.maps.get(id) ?? null;
  }
  async create(departmentId: string, data: { name: string; value: MapValue }) {
    const now = new Date();
    const map = { id: crypto.randomUUID(), departmentId, createdAt: now, updatedAt: now, ...data };
    this.maps.set(map.id, map as unknown as DepartmentMapEntity);
    return this.maps.get(map.id)!;
  }
  async update(id: string, data: { name?: string; value?: MapValue }) {
    const current = this.maps.get(id);
    if (!current) return null;
    const next = { ...current, name: data.name ?? current.name, value: (data.value ?? current.value) as DepartmentMapEntity['value'] };
    this.maps.set(id, next);
    return next;
  }
  async delete(id: string) {
    return this.maps.delete(id);
  }
}

class FakeDepartmentsService {
  async get(id: string) {
    if (id === MISSING_ID) throw new NotFoundException();
  }
}

class FakeStorageFileClient {
  readonly fetched: string[] = [];

  async fetchContent(fileId: string) {
    this.fetched.push(fileId);
    return FILES[fileId] ?? null;
  }
}

describe('MapsService', () => {
  let service: MapsService;
  let storageFiles: FakeStorageFileClient;

  beforeEach(() => {
    storageFiles = new FakeStorageFileClient();
    service = new MapsService(
      new FakeRepository() as unknown as MapsRepository,
      new FakeDepartmentsService() as unknown as DepartmentsService,
      storageFiles as unknown as StorageFileClient,
    );
  });

  it('creates maps with an empty value and lists them per department', async () => {
    const created = await service.create(DEPARTMENT_ID, { name: 'Floor 1' });
    const page = await service.list(DEPARTMENT_ID, { page: 1, pageSize: 20 });
    expect(page).toMatchObject({ total: 1, page: 1, pageSize: 20 });
    expect(page.items[0]).toMatchObject({ id: created.id, name: 'Floor 1', value: EMPTY_MAP_VALUE });
    expect((await service.list(OTHER_DEPARTMENT_ID, { page: 1, pageSize: 20 })).total).toBe(0);
  });

  it('rejects an unknown department', async () => {
    await expect(service.create(MISSING_ID, { name: 'Floor 1' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('renames a map and returns 404 for an unknown one', async () => {
    const created = await service.create(DEPARTMENT_ID, { name: 'Floor 1' });
    await expect(service.update(created.id, { name: 'Ground floor' })).resolves.toMatchObject({ name: 'Ground floor' });
    await expect(service.update(MISSING_ID, { name: 'x' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('replaces the value with a plain copy', async () => {
    const { id } = await service.create(DEPARTMENT_ID, { name: 'Floor 1' });
    const value = { ...valueWithImage(PNG_FILE_ID), extra: true } as MapValueDto;
    const updated = await service.update(id, { value });
    expect(updated.value).toEqual(valueWithImage(PNG_FILE_ID));
    expect((await service.get(id)).value).toEqual(valueWithImage(PNG_FILE_ID));
  });

  it('accepts only a stored image file', async () => {
    const { id } = await service.create(DEPARTMENT_ID, { name: 'Floor 1' });
    await expect(service.update(id, { value: valueWithImage(TEXT_FILE_ID) })).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.update(id, { value: valueWithImage(LARGE_FILE_ID) })).rejects.toBeInstanceOf(PayloadTooLargeException);
    await expect(service.update(id, { value: valueWithImage(MISSING_ID) })).rejects.toBeInstanceOf(NotFoundException);
    expect((await service.get(id)).value).toEqual(EMPTY_MAP_VALUE);
  });

  it('checks the image only when it changes', async () => {
    const { id } = await service.create(DEPARTMENT_ID, { name: 'Floor 1' });
    await service.update(id, { value: valueWithImage(PNG_FILE_ID) });
    const value = valueWithImage(PNG_FILE_ID);
    await service.update(id, { value: { ...value, layers: value.layers.slice(0, 1) } });
    expect(storageFiles.fetched).toEqual([PNG_FILE_ID]);
  });

  it('deletes a map', async () => {
    const { id } = await service.create(DEPARTMENT_ID, { name: 'Floor 1' });
    await service.remove(id);
    await expect(service.get(id)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
