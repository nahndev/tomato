import { NotFoundException } from "@nestjs/common";
import { RoleStatus } from "@tomato/constants";
import { beforeEach, describe, expect, it } from "vitest";
import type { Role as RoleEntity } from "../../generated/prisma/client";
import type { DepartmentsService } from "../departments/departments.service";
import type { RolesRepository } from "./roles.repository";
import { RolesService } from "./roles.service";
import type { RoleUpdateData } from "./roles.types";

const DEPARTMENT_ID = "b1d2c3e4-0a1b-4c2d-8e3f-1a2b3c4d5e6f";
const OTHER_DEPARTMENT_ID = "c2e3d4f5-1b2c-4d3e-9f40-2b3c4d5e6f70";
const MISSING_ID = "a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49";
const DEFAULT_COLOR = "#64748b";

function makeEntity(
  id: string,
  departmentId: string,
  name: string,
): RoleEntity {
  const now = new Date();
  return {
    id,
    departmentId,
    name,
    description: null,
    color: DEFAULT_COLOR,
    status: RoleStatus.ACTIVE,
    createdAt: now,
    updatedAt: now,
  };
}

class FakeRepository {
  readonly store = new Map<string, RoleEntity>();

  async findMany(departmentId: string) {
    const items = [...this.store.values()].filter(
      (entity) => entity.departmentId === departmentId,
    );
    return { items, total: items.length };
  }
  async findById(departmentId: string, id: string) {
    const entity = this.store.get(id);
    return entity?.departmentId === departmentId ? entity : null;
  }
  async create(departmentId: string, data: { name: string }) {
    const entity = makeEntity(crypto.randomUUID(), departmentId, data.name);
    this.store.set(entity.id, entity);
    return entity;
  }
  async update(departmentId: string, id: string, data: RoleUpdateData) {
    const current = await this.findById(departmentId, id);
    if (!current) return null;
    const defined = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
    const next: RoleEntity = { ...current, ...defined };
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

describe("RolesService", () => {
  let repository: FakeRepository;
  let service: RolesService;

  beforeEach(() => {
    repository = new FakeRepository();
    service = new RolesService(
      repository as unknown as RolesRepository,
      new FakeDepartmentsService() as unknown as DepartmentsService,
    );
  });

  it("creates and lists roles of a department only", async () => {
    const created = await service.create(DEPARTMENT_ID, { name: "Manager" });
    await service.create(OTHER_DEPARTMENT_ID, { name: "Staff" });
    const page = await service.list(DEPARTMENT_ID, { page: 1, pageSize: 20 });
    expect(page).toMatchObject({ total: 1, page: 1, pageSize: 20 });
    expect(page.items[0]).toMatchObject({
      id: created.id,
      departmentId: DEPARTMENT_ID,
      name: "Manager",
    });
  });

  it("throws when the department is unknown", async () => {
    await expect(
      service.list(MISSING_ID, { page: 1, pageSize: 20 }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      service.create(MISSING_ID, { name: "Manager" }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("gets a role and throws for an unknown id or another department", async () => {
    const created = await service.create(DEPARTMENT_ID, { name: "Manager" });
    await expect(service.get(DEPARTMENT_ID, created.id)).resolves.toMatchObject(
      { name: "Manager" },
    );
    await expect(service.get(DEPARTMENT_ID, MISSING_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(
      service.get(OTHER_DEPARTMENT_ID, created.id),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("renames a role and throws for an unknown id", async () => {
    const created = await service.create(DEPARTMENT_ID, { name: "Manager" });
    await expect(
      service.update(DEPARTMENT_ID, created.id, { name: "Lead" }),
    ).resolves.toMatchObject({
      name: "Lead",
    });
    await expect(
      service.update(DEPARTMENT_ID, MISSING_ID, { name: "Lead" }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("updates the description, color and status of a role", async () => {
    const created = await service.create(DEPARTMENT_ID, { name: "Manager" });
    expect(created).toMatchObject({
      description: null,
      color: DEFAULT_COLOR,
      status: RoleStatus.ACTIVE,
    });
    await expect(
      service.update(DEPARTMENT_ID, created.id, {
        description: "Runs the team",
        color: "#22c55e",
        status: RoleStatus.INACTIVE,
      }),
    ).resolves.toMatchObject({
      name: "Manager",
      description: "Runs the team",
      color: "#22c55e",
      status: RoleStatus.INACTIVE,
    });
    await expect(
      service.update(DEPARTMENT_ID, created.id, { description: null }),
    ).resolves.toMatchObject({ description: null, color: "#22c55e" });
  });

  it("removes a role and throws for an unknown id", async () => {
    const created = await service.create(DEPARTMENT_ID, { name: "Manager" });
    await service.remove(DEPARTMENT_ID, created.id);
    expect(repository.store.size).toBe(0);
    await expect(
      service.remove(DEPARTMENT_ID, created.id),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
