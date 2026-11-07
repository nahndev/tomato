import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import type { User } from "@tomato/types";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StorageProvider } from "@/modules/file";
import { apiClient } from "@/shared/lib/api-client";
import { UserList } from "./user-list";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { get: vi.fn(), getUri: vi.fn() },
  getApiError: vi.fn(),
}));

const DEPARTMENT_ID = "department";
const DATE = "2026-11-07T00:00:00.000Z";
const MANAGER = { id: "manager", name: "Manager", color: "#22c55e" };
const STAFF = { id: "staff", name: "Staff", color: "#3b82f6" };
const USER: User = {
  id: "user",
  departmentId: DEPARTMENT_ID,
  eid: null,
  name: "Ann",
  familyName: "Lee",
  email: "ann@example.com",
  tel: "+84 123 456",
  avatarFileId: null,
  addresses: [],
  roleIds: [MANAGER.id, STAFF.id],
  roles: [MANAGER, STAFF],
  createdAt: DATE,
  updatedAt: DATE,
};

function renderList(roleId?: string) {
  return render(
    <NuqsTestingAdapter>
      <QueryClientProvider client={new QueryClient()}>
        <StorageProvider>
          <UserList departmentId={DEPARTMENT_ID} roleId={roleId} />
        </StorageProvider>
      </QueryClientProvider>
    </NuqsTestingAdapter>,
  );
}

const ringOf = (initials: string) =>
  screen.getByText(initials).closest("[data-slot=avatar]")?.parentElement;

describe("UserList", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { items: [USER], total: 1, page: 1, pageSize: 100 },
    });
  });

  it("shows avatar, full name, email, tel and role names in that order", async () => {
    renderList();

    const cells = within((await screen.findByText("Ann Lee")).closest("tr")!).getAllByRole("cell");
    expect(cells[0]).toHaveTextContent("AL");
    expect(cells[1]).toHaveTextContent("Ann Lee");
    expect(cells[2]).toHaveTextContent("ann@example.com");
    expect(cells[3]).toHaveTextContent("+84 123 456");
    expect(cells[4]).toHaveTextContent("Manager, Staff");
  });

  it("colors the ring with the first role", async () => {
    renderList();

    await screen.findByText("Ann Lee");
    expect(ringOf("AL")).toHaveStyle({ borderColor: MANAGER.color });
  });

  it("colors the ring with the listed role inside a role drawer", async () => {
    renderList(STAFF.id);

    await screen.findByText("Ann Lee");
    expect(ringOf("AL")).toHaveStyle({ borderColor: STAFF.color });
  });
});
