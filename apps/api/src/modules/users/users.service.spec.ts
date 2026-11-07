import { BadRequestException, NotFoundException, PayloadTooLargeException } from '@nestjs/common';
import { AVATAR_MAX_SIZE } from '@tomato/constants';
import { beforeEach, describe, expect, it } from 'vitest';
import type { DepartmentsService } from '../departments/departments.service';
import type { StorageFileClient } from './storage-file.client';
import type { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import type { UserUpdateData, UserWithRelations } from './users.types';

const DEPARTMENT_ID = 'b1d2c3e4-0a1b-4c2d-8e3f-1a2b3c4d5e6f';
const OTHER_DEPARTMENT_ID = 'c2e3d4f5-1b2c-4d3e-9f40-2b3c4d5e6f70';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';
const PNG_FILE_ID = 'e4a5f6b7-3d4e-4f50-b162-4d5e6f708192';
const ROLE_ID = 'd3f4e5a6-2c3d-4e4f-a051-3c4d5e6f7081';
const OTHER_ROLE_ID = 'e4a5f6b7-3d4e-4f50-b162-4d5e6f708192';
const ROLE = { name: 'Manager', color: '#22c55e' };
const ADDRESS = { street: '1 Main St', city: 'Hanoi', postalCode: null, country: 'Vietnam' };
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

function makeEntity(id: string, departmentId: string, name: string, email: string): UserWithRelations {
  const now = new Date();
  return {
    id,
    departmentId,
    eid: null,
    name,
    familyName: null,
    email,
    tel: null,
    avatarFileId: null,
    addresses: [],
    roles: [],
    createdAt: now,
    updatedAt: now,
  };
}

class FakeRepository {
  readonly store = new Map<string, UserWithRelations>();

  async findMany(departmentId: string, _skip: number, _take: number, roleId?: string) {
    const items = [...this.store.values()].filter(
      (entity) =>
        entity.departmentId === departmentId && (!roleId || entity.roles.some((role) => role.roleId === roleId)),
    );
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
  async update(departmentId: string, id: string, { addresses, roleIds, ...fields }: UserUpdateData) {
    const current = await this.findById(departmentId, id);
    if (!current) return null;
    const defined = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
    const next: UserWithRelations = {
      ...current,
      ...defined,
      addresses: addresses
        ? addresses.map((address, position) => ({ ...address, id: String(position), userId: id, position }))
        : current.addresses,
      roles: roleIds ? roleIds.map((roleId) => ({ roleId, role: ROLE })) : current.roles,
    };
    this.store.set(id, next);
    return next;
  }
  async countRoles(departmentId: string, roleIds: string[]) {
    return departmentId === DEPARTMENT_ID ? roleIds.filter((id) => id === ROLE_ID).length : 0;
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

class FakeStorageFiles {
  readonly files = new Map<string, Buffer>();

  async fetchContent(fileId: string) {
    return this.files.get(fileId) ?? null;
  }
}

describe('UsersService', () => {
  let repository: FakeRepository;
  let storageFiles: FakeStorageFiles;
  let service: UsersService;

  beforeEach(() => {
    repository = new FakeRepository();
    storageFiles = new FakeStorageFiles();
    storageFiles.files.set(PNG_FILE_ID, PNG);
    service = new UsersService(
      repository as unknown as UsersRepository,
      new FakeDepartmentsService() as unknown as DepartmentsService,
      storageFiles as unknown as StorageFileClient,
    );
  });

  it('creates and lists users of a department only', async () => {
    const created = await service.create(DEPARTMENT_ID, { name: 'Ann', email: 'ann@example.com' });
    await service.create(OTHER_DEPARTMENT_ID, { name: 'Bob', email: 'bob@example.com' });
    const page = await service.list(DEPARTMENT_ID, { page: 1, pageSize: 20 });
    expect(page).toMatchObject({ total: 1, page: 1, pageSize: 20 });
    expect(page.items[0]).toMatchObject({ id: created.id, departmentId: DEPARTMENT_ID, email: 'ann@example.com' });
  });

  it('returns the name and color of each role', async () => {
    const created = await service.create(DEPARTMENT_ID, { name: 'Ann', email: 'ann@example.com' });
    const updated = await service.update(DEPARTMENT_ID, created.id, { roleIds: [ROLE_ID] });
    expect(updated.roleIds).toEqual([ROLE_ID]);
    expect(updated.roles).toEqual([{ id: ROLE_ID, ...ROLE }]);
  });

  it('lists only the users holding a role', async () => {
    const holder = await service.create(DEPARTMENT_ID, { name: 'Ann', email: 'ann@example.com' });
    await service.create(DEPARTMENT_ID, { name: 'Bob', email: 'bob@example.com' });
    await service.update(DEPARTMENT_ID, holder.id, { roleIds: [ROLE_ID] });
    const page = await service.list(DEPARTMENT_ID, { page: 1, pageSize: 20, roleId: ROLE_ID });
    expect(page.items.map(({ id }) => id)).toEqual([holder.id]);
    expect((await service.list(DEPARTMENT_ID, { page: 1, pageSize: 20 })).total).toBe(2);
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

  it('updates details, addresses and roles', async () => {
    const created = await service.create(DEPARTMENT_ID, { name: 'Ann', email: 'ann@example.com' });
    const updated = await service.update(DEPARTMENT_ID, created.id, {
      eid: 'E-001',
      familyName: 'Lee',
      tel: '+84 123 456',
      addresses: [{ street: '1 Main St', city: 'Hanoi', country: 'Vietnam' }],
      roleIds: [ROLE_ID],
    });
    expect(updated).toMatchObject({
      eid: 'E-001',
      name: 'Ann',
      familyName: 'Lee',
      tel: '+84 123 456',
      addresses: [ADDRESS],
      roleIds: [ROLE_ID],
    });
  });

  it('rejects a role outside the department without changing the user', async () => {
    const created = await service.create(DEPARTMENT_ID, { name: 'Ann', email: 'ann@example.com' });
    await expect(
      service.update(DEPARTMENT_ID, created.id, { familyName: 'Lee', roleIds: [ROLE_ID, OTHER_ROLE_ID] }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.get(DEPARTMENT_ID, created.id)).resolves.toMatchObject({ familyName: null, roleIds: [] });
  });

  describe('avatar', () => {
    it('keeps the id of the storage file', async () => {
      const created = await service.create(DEPARTMENT_ID, { name: 'Ann', email: 'ann@example.com' });
      const updated = await service.uploadAvatar(DEPARTMENT_ID, created.id, PNG_FILE_ID);
      expect(updated.avatarFileId).toBe(PNG_FILE_ID);
    });

    it('rejects a missing file, one that is not an image, or one that is too large', async () => {
      const created = await service.create(DEPARTMENT_ID, { name: 'Ann', email: 'ann@example.com' });
      storageFiles.files.set('svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'));
      storageFiles.files.set('large', Buffer.concat([PNG, Buffer.alloc(AVATAR_MAX_SIZE)]));
      await expect(service.uploadAvatar(DEPARTMENT_ID, created.id, MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
      await expect(service.uploadAvatar(DEPARTMENT_ID, created.id, 'svg')).rejects.toBeInstanceOf(BadRequestException);
      await expect(service.uploadAvatar(DEPARTMENT_ID, created.id, 'large')).rejects.toBeInstanceOf(
        PayloadTooLargeException,
      );
      await expect(service.get(DEPARTMENT_ID, created.id)).resolves.toMatchObject({ avatarFileId: null });
    });

    it('throws for an unknown user', async () => {
      await expect(service.uploadAvatar(DEPARTMENT_ID, MISSING_ID, PNG_FILE_ID)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
