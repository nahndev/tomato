import { NotFoundException } from "@nestjs/common";
import { PermissionResource } from "@tomato/constants";
import { beforeEach, describe, expect, it } from "vitest";
import type { RolePermission as RolePermissionEntity } from "../../generated/prisma/client";
import type { DepartmentsService } from "../departments/departments.service";
import type { RolesService } from "../roles/roles.service";
import type { PermissionsRepository } from "./permissions.repository";
import { PermissionsService } from "./permissions.service";
import type { PermissionFlags } from "./permissions.types";

const DEPARTMENT_ID = "b1d2c3e4-0a1b-4c2d-8e3f-1a2b3c4d5e6f";
const OTHER_DEPARTMENT_ID = "c2e3d4f5-1b2c-4d3e-9f40-2b3c4d5e6f70";
const ROLE_ID = "d3f4e5a6-2c3d-4e4f-80a1-3c4d5e6f7081";
const OTHER_ROLE_ID = "e4a5f6b7-3d4e-4f50-91b2-4d5e6f708192";
const MISSING_ID = "a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49";

class FakeRepository {
  readonly store = new Map<string, RolePermissionEntity>();

  async findMany(departmentId: string, roleId: string | undefined) {
    const items = [...this.store.values()].filter(
      (entity) =>
        entity.departmentId === departmentId &&
        (!roleId || entity.roleId === roleId),
    );
    return { items, total: items.length };
  }
  async findById(departmentId: string, id: string) {
    const entity = this.store.get(id);
    return entity?.departmentId === departmentId ? entity : null;
  }
  async create(
    departmentId: string,
    data: { roleId: string; resource: string } & PermissionFlags,
  ) {
    const now = new Date();
    const entity: RolePermissionEntity = {
      id: crypto.randomUUID(),
      departmentId,
      roleId: data.roleId,
      resource: data.resource,
      canCreate: data.canCreate ?? false,
      canRead: data.canRead ?? false,
      canUpdate: data.canUpdate ?? false,
      canDelete: data.canDelete ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(entity.id, entity);
    return entity;
  }
  async update(departmentId: string, id: string, data: PermissionFlags) {
    const current = await this.findById(departmentId, id);
    if (!current) return null;
    const next = {
      ...current,
      ...Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      ),
    };
    this.store.set(id, next);
    return next;
  }
  async delete(departmentId: string, id: string) {
    return (await this.findById(departmentId, id))
      ? this.store.delete(id)
      : false;
  }
}

class FakeDepartmentsService {
  async get(id: string) {
    if (id === MISSING_ID) throw new NotFoundException();
  }
}

class FakeRolesService {
  async get(departmentId: string, id: string) {
    if (departmentId !== DEPARTMENT_ID || id === MISSING_ID)
      throw new NotFoundException();
  }
}

describe("PermissionsService", () => {
  let repository: FakeRepository;
  let service: PermissionsService;

  beforeEach(() => {
    repository = new FakeRepository();
    service = new PermissionsService(
      repository as unknown as PermissionsRepository,
      new FakeDepartmentsService() as unknown as DepartmentsService,
      new FakeRolesService() as unknown as RolesService,
    );
  });

  it("creates a permission with every flag off by default", async () => {
    await expect(
      service.create(DEPARTMENT_ID, {
        roleId: ROLE_ID,
        resource: PermissionResource.DOCUMENT,
      }),
    ).resolves.toMatchObject({
      departmentId: DEPARTMENT_ID,
      roleId: ROLE_ID,
      resource: PermissionResource.DOCUMENT,
      canCreate: false,
      canRead: false,
      canUpdate: false,
      canDelete: false,
    });
  });

  it("throws when creating for an unknown role or a role of another department", async () => {
    await expect(
      service.create(DEPARTMENT_ID, {
        roleId: MISSING_ID,
        resource: PermissionResource.DOCUMENT,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      service.create(OTHER_DEPARTMENT_ID, {
        roleId: ROLE_ID,
        resource: PermissionResource.DOCUMENT,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("lists permissions of a department, optionally of one role", async () => {
    await service.create(DEPARTMENT_ID, {
      roleId: ROLE_ID,
      resource: PermissionResource.DOCUMENT,
    });
    await service.create(DEPARTMENT_ID, {
      roleId: OTHER_ROLE_ID,
      resource: PermissionResource.DOCUMENT,
    });
    const query = { page: 1, pageSize: 20 };
    await expect(
      service.list(DEPARTMENT_ID, undefined, query),
    ).resolves.toMatchObject({ total: 2 });
    await expect(
      service.list(DEPARTMENT_ID, ROLE_ID, query),
    ).resolves.toMatchObject({ total: 1 });
    await expect(
      service.list(MISSING_ID, undefined, query),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("updates only the given flags and throws for an unknown id", async () => {
    const created = await service.create(DEPARTMENT_ID, {
      roleId: ROLE_ID,
      resource: PermissionResource.DOCUMENT,
      canRead: true,
    });
    await expect(
      service.update(DEPARTMENT_ID, created.id, { canUpdate: true }),
    ).resolves.toMatchObject({ canRead: true, canUpdate: true });
    await expect(
      service.update(DEPARTMENT_ID, MISSING_ID, { canUpdate: true }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("gets and removes a permission, throwing for another department", async () => {
    const created = await service.create(DEPARTMENT_ID, {
      roleId: ROLE_ID,
      resource: PermissionResource.DOCUMENT,
    });
    await expect(
      service.get(OTHER_DEPARTMENT_ID, created.id),
    ).rejects.toBeInstanceOf(NotFoundException);
    await service.remove(DEPARTMENT_ID, created.id);
    expect(repository.store.size).toBe(0);
    await expect(
      service.remove(DEPARTMENT_ID, created.id),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
