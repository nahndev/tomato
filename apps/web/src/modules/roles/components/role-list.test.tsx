import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoleStatus } from "@tomato/constants";
import type { Role } from "@tomato/types";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/lib/api-client";
import { RoleList } from "./role-list";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { get: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  getApiError: vi.fn(),
}));

const DEPARTMENT_ID = "department";
const ROLES_URL = `/departments/${DEPARTMENT_ID}/roles`;
const USERS_URL = `/departments/${DEPARTMENT_ID}/users`;
const DATE = "2026-11-07T00:00:00.000Z";
const ROLE: Role = {
  id: "role",
  departmentId: DEPARTMENT_ID,
  name: "Manager",
  description: "Runs the team",
  color: "#22c55e",
  status: RoleStatus.INACTIVE,
  createdAt: DATE,
  updatedAt: DATE,
};

function renderList(searchParams = "") {
  return render(
    <NuqsTestingAdapter searchParams={searchParams}>
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <RoleList departmentId={DEPARTMENT_ID} />
      </QueryClientProvider>
    </NuqsTestingAdapter>,
  );
}

describe("RoleList", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.get).mockImplementation(async (url: string) => ({
      data:
        url === ROLES_URL
          ? { items: [ROLE], total: 1, page: 1, pageSize: 100 }
          : url === `${ROLES_URL}/${ROLE.id}`
            ? ROLE
            : { items: [], total: 0, page: 1, pageSize: 100 },
    }));
  });

  it("shows the role details without row actions", async () => {
    renderList();

    expect(await screen.findByText(ROLE.name)).toBeInTheDocument();
    expect(screen.getByText("Runs the team")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: `Edit ${ROLE.name}` }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: `Delete ${ROLE.name}` }),
    ).not.toBeInTheDocument();
  });

  it("opens the drawer on click and lists only the users of the role", async () => {
    const user = userEvent.setup();
    renderList();

    await user.click(await screen.findByRole("button", { name: /Manager/ }));

    expect(await screen.findByLabelText("Name")).toHaveValue(ROLE.name);
    expect(screen.getByLabelText("Description")).toHaveValue("Runs the team");
    expect(screen.queryByRole("button", { name: /New user/ })).toBeNull();
    await waitFor(() =>
      expect(apiClient.get).toHaveBeenCalledWith(USERS_URL, {
        params: { pageSize: 100, roleId: ROLE.id },
      }),
    );
  });

  it("autosaves an edited description, sending null when it is emptied", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.patch).mockResolvedValue({
      data: { ...ROLE, description: null },
    });
    renderList(`?role=${ROLE.id}`);

    await user.clear(await screen.findByLabelText("Description"));

    await waitFor(
      () =>
        expect(apiClient.patch).toHaveBeenCalledWith(
          `${ROLES_URL}/${ROLE.id}`,
          {
            name: ROLE.name,
            description: null,
            color: ROLE.color,
            status: ROLE.status,
          },
        ),
      { timeout: 2000 },
    );
  });
});
