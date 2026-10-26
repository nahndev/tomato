import { NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it } from "vitest";
import type { RolePermission as RolePermissionEntity } from "../../generated/prisma/client";
import type { DepartmentsService } from "../departments/departments.service";
import type { DocumentsService } from "../documents/documents.service";
import type { RolesService } from "../roles/roles.service";
import type { UsersService } from "../users/users.service";
import type { PermissionsRepository } from "./permissions.repository";
import { PermissionsService } from "./permissions.service";
import type { PermissionFilter, PermissionFlags } from "./permissions.types";

const DOCUMENTS_ALL = { type: "document", id: "all" } as const;
const DEPARTMENT_ID = "b1d2c3e4-0a1b-4c2d-8e3f-1a2b3c4d5e6f";
const OTHER_DEPARTMENT_ID = "c2e3d4f5-1b2c-4d3e-9f40-2b3c4d5e6f70";
const ROLE_ID = "d3f4e5a6-2c3d-4e4f-80a1-3c4d5e6f7081";
const OTHER_ROLE_ID = "e4a5f6b7-3d4e-4f50-91b2-4d5e6f708192";
const DOCUMENT_ID = "f5b6a7c8-4e5f-4061-a2c3-5e6f70819203";
const MISSING_ID = "a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49";

class FakeRepository {
  readonly roleDepartments = new Map([
    [ROLE_ID, DEPARTMENT_ID],
    [OTHER_ROLE_ID, DEPARTMENT_ID],
  ]);
  readonly store = new Map<string, RolePermissionEntity>();

  async findMany(
    _departmentId: string,
    { roleId, resourceType, resourceId }: PermissionFilter,
  ) {
    const items = [...this.store.values()].filter(
      (entity) =>
        (!roleId || entity.roleId === roleId) &&
        (!resourceType || entity.resourceType === resourceType) &&
        (!resourceId || entity.resourceId === resourceId),
    );
    return { items, total: items.length };
  }
  async findById(departmentId: string, id: string) {
    const entity = this.store.get(id);
    return entity && this.roleDepartments.get(entity.roleId) === departmentId
      ? entity
      : null;
  }
  async create(
    data: { roleId: string; resourceType: string; resourceId: string } & PermissionFlags,
  ) {
    const now = new Date();
    const entity: RolePermissionEntity = {
      id: crypto.randomUUID(),
      roleId: data.roleId,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
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

class FakeDocumentsService {
  async get(departmentId: string, id: string) {
    if (departmentId !== DEPARTMENT_ID || id !== DOCUMENT_ID)
      throw new NotFoundException();
  }
}

class FakeUsersService {
  async get() {
    throw new NotFoundException();
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
      new FakeDocumentsService() as unknown as DocumentsService,
      new FakeUsersService() as unknown as UsersService,
    );
  });

  it("creates a permission with every flag off by default", async () => {
    await expect(
      service.create(DEPARTMENT_ID, {
        roleId: ROLE_ID,
        resource: DOCUMENTS_ALL,
      }),
    ).resolves.toMatchObject({
      roleId: ROLE_ID,
      resource: DOCUMENTS_ALL,
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
        resource: DOCUMENTS_ALL,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      service.create(OTHER_DEPARTMENT_ID, {
        roleId: ROLE_ID,
        resource: DOCUMENTS_ALL,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("checks that a specific item exists in the department", async () => {
    await expect(
      service.create(DEPARTMENT_ID, {
        roleId: ROLE_ID,
        resource: { type: "document", id: DOCUMENT_ID },
      }),
    ).resolves.toMatchObject({ resource: { type: "document", id: DOCUMENT_ID } });
    await expect(
      service.create(DEPARTMENT_ID, {
        roleId: ROLE_ID,
        resource: { type: "document", id: MISSING_ID },
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      service.create(DEPARTMENT_ID, {
        roleId: ROLE_ID,
        resource: { type: "user", id: MISSING_ID },
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("lists permissions of a department, optionally of one role", async () => {
    await service.create(DEPARTMENT_ID, {
      roleId: ROLE_ID,
      resource: DOCUMENTS_ALL,
    });
    await service.create(DEPARTMENT_ID, {
      roleId: OTHER_ROLE_ID,
      resource: DOCUMENTS_ALL,
    });
    const query = { page: 1, pageSize: 20 };
    await expect(service.list(DEPARTMENT_ID, {}, query)).resolves.toMatchObject(
      { total: 2 },
    );
    await expect(
      service.list(DEPARTMENT_ID, { roleId: ROLE_ID }, query),
    ).resolves.toMatchObject({ total: 1 });
    await expect(
      service.list(DEPARTMENT_ID, { resourceType: "document", resourceId: "other" }, query),
    ).resolves.toMatchObject({ total: 0 });
    await expect(service.list(MISSING_ID, {}, query)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("updates only the given flags and throws for an unknown id", async () => {
    const created = await service.create(DEPARTMENT_ID, {
      roleId: ROLE_ID,
      resource: DOCUMENTS_ALL,
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
      resource: DOCUMENTS_ALL,
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
