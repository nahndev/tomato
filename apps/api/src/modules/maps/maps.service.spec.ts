import { BadRequestException, NotFoundException, PayloadTooLargeException } from '@nestjs/common';
import { MAP_IMAGE_MAX_SIZE } from '@tomato/constants';
import { beforeEach, describe, expect, it } from 'vitest';
import type { StorageFileClient } from '../../common';
import type {
  DepartmentMap as DepartmentMapEntity,
  MapPin as MapPinEntity,
} from '../../generated/prisma/client';
import type { DepartmentsService } from '../departments/departments.service';
import type { MapsRepository } from './maps.repository';
import { MapsService } from './maps.service';
import type { MapPinData } from './maps.types';

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

class FakeRepository {
  readonly maps = new Map<string, DepartmentMapEntity>();
  readonly pins = new Map<string, MapPinEntity>();

  async findMany(departmentId: string) {
    const items = [...this.maps.values()].filter((map) => map.departmentId === departmentId);
    return { items, total: items.length };
  }
  async findById(id: string) {
    const map = this.maps.get(id);
    return map ? { ...map, pins: [...this.pins.values()].filter((pin) => pin.mapId === id) } : null;
  }
  async create(departmentId: string, data: { name: string }) {
    const now = new Date();
    const map = { id: crypto.randomUUID(), departmentId, imageFileId: null, createdAt: now, updatedAt: now, ...data };
    this.maps.set(map.id, map);
    return map;
  }
  async update(id: string, data: { name?: string; imageFileId?: string }) {
    const current = this.maps.get(id);
    if (!current) return null;
    const next = { ...current, name: data.name ?? current.name, imageFileId: data.imageFileId ?? current.imageFileId };
    this.maps.set(id, next);
    return next;
  }
  async delete(id: string) {
    for (const pin of this.pins.values()) if (pin.mapId === id) this.pins.delete(pin.id);
    return this.maps.delete(id);
  }
  async createPin(mapId: string, data: MapPinData) {
    if (!this.maps.has(mapId)) return null;
    const now = new Date();
    const pin = { id: crypto.randomUUID(), mapId, createdAt: now, updatedAt: now, ...data, description: data.description ?? '' };
    this.pins.set(pin.id, pin);
    return pin;
  }
  async updatePin(mapId: string, id: string, data: Partial<MapPinData>) {
    const current = this.pins.get(id);
    if (current?.mapId !== mapId) return null;
    const defined = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
    const next = { ...current, ...defined };
    this.pins.set(id, next);
    return next;
  }
  async deletePin(mapId: string, id: string) {
    return this.pins.get(id)?.mapId === mapId ? this.pins.delete(id) : false;
  }
}

class FakeDepartmentsService {
  async get(id: string) {
    if (id === MISSING_ID) throw new NotFoundException();
  }
}

class FakeStorageFileClient {
  async fetchContent(fileId: string) {
    return FILES[fileId] ?? null;
  }
}

describe('MapsService', () => {
  let service: MapsService;

  beforeEach(() => {
    service = new MapsService(
      new FakeRepository() as unknown as MapsRepository,
      new FakeDepartmentsService() as unknown as DepartmentsService,
      new FakeStorageFileClient() as unknown as StorageFileClient,
    );
  });

  it('creates and lists maps of a department only', async () => {
    const created = await service.create(DEPARTMENT_ID, { name: 'Floor 1' });
    const page = await service.list(DEPARTMENT_ID, { page: 1, pageSize: 20 });
    expect(page).toMatchObject({ total: 1, page: 1, pageSize: 20 });
    expect(page.items[0]).toMatchObject({ id: created.id, name: 'Floor 1', imageFileId: null });
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

  it('sets an image only from a stored image file', async () => {
    const { id } = await service.create(DEPARTMENT_ID, { name: 'Floor 1' });
    await expect(service.setImage(id, PNG_FILE_ID)).resolves.toMatchObject({ imageFileId: PNG_FILE_ID });
    await expect(service.setImage(id, TEXT_FILE_ID)).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.setImage(id, LARGE_FILE_ID)).rejects.toBeInstanceOf(PayloadTooLargeException);
    await expect(service.setImage(id, MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.setImage(MISSING_ID, PNG_FILE_ID)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('adds, moves and removes pins of a map', async () => {
    const { id: mapId } = await service.create(DEPARTMENT_ID, { name: 'Floor 1' });
    const pin = await service.addPin(mapId, { label: 'Entrance', x: 0.25, y: 0.5 });
    expect(pin).toMatchObject({ mapId, label: 'Entrance', description: '', x: 0.25, y: 0.5 });

    await expect(service.updatePin(mapId, pin.id, { x: 0.75 })).resolves.toMatchObject({ label: 'Entrance', x: 0.75, y: 0.5 });
    expect((await service.get(mapId)).pins).toHaveLength(1);

    await service.removePin(mapId, pin.id);
    expect((await service.get(mapId)).pins).toHaveLength(0);
    await expect(service.removePin(mapId, pin.id)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns 404 for pins of an unknown map or of another map', async () => {
    const { id: mapId } = await service.create(DEPARTMENT_ID, { name: 'Floor 1' });
    const { id: otherMapId } = await service.create(DEPARTMENT_ID, { name: 'Floor 2' });
    const pin = await service.addPin(mapId, { label: 'Entrance', x: 0, y: 1 });

    await expect(service.addPin(MISSING_ID, { label: 'x', x: 0, y: 0 })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.updatePin(otherMapId, pin.id, { label: 'x' })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.removePin(otherMapId, pin.id)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes a map with its pins', async () => {
    const { id: mapId } = await service.create(DEPARTMENT_ID, { name: 'Floor 1' });
    await service.addPin(mapId, { label: 'Entrance', x: 0, y: 0 });
    await service.remove(mapId);
    await expect(service.get(mapId)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(mapId)).rejects.toBeInstanceOf(NotFoundException);
  });
});
