import { WidgetType } from "@tomato/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UsersWidgetItem } from "./users-widget-item";

/** jsdom measures every element as 0×0, so the virtualized user list would render no option. */
const LIST_WIDTH = 320;
const LIST_HEIGHT = 240;

const { useAllUsers } = vi.hoisted(() => ({
  useAllUsers: vi.fn(() => ({
    users: [
      { id: "user-0000aaaa", name: "Ada", email: "ada@example.com" },
      { id: "user-0000bbbb", name: "Bob", email: "bob@example.com" },
    ],
    isLoading: false,
    hasError: false,
  })),
}));

vi.mock("@/modules/user", () => ({
  getUserFullName: ({ name }: { name: string }) => name,
  useAllUsers,
}));

const WIDGET = { id: "people", type: WidgetType.USERS, label: "Approvers" };

describe("UsersWidgetItem", () => {
  beforeEach(() => {
    vi.spyOn(Element.prototype, "clientWidth", "get").mockReturnValue(LIST_WIDTH);
    vi.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(LIST_HEIGHT);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads the users of its department, or of every department", () => {
    render(<UsersWidgetItem widget={{ ...WIDGET, departmentUuid: "dep-1" }} />);
    expect(useAllUsers).toHaveBeenLastCalledWith("dep-1");

    render(<UsersWidgetItem widget={WIDGET} />);
    expect(useAllUsers).toHaveBeenLastCalledWith(undefined);
  });

  it("shows the selected users, and a short id for an unknown one", () => {
    render(<UsersWidgetItem widget={WIDGET} value={["user-0000aaaa", "user-9999zzzz"]} />);

    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("User 9999zzzz")).toBeInTheDocument();
  });

  it("adds a picked user to the list of ids", async () => {
    const onChange = vi.fn();
    render(<UsersWidgetItem widget={WIDGET} value={["user-0000aaaa"]} onChange={onChange} />);

    await userEvent.click(screen.getByRole("combobox", { name: "Approvers" }));
    expect(screen.queryByRole("option", { name: /Ada/ })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("option", { name: /Bob/ }));

    expect(onChange).toHaveBeenCalledWith(["user-0000aaaa", "user-0000bbbb"]);
  });

  it("removes a user from the list of ids", async () => {
    const onChange = vi.fn();
    render(<UsersWidgetItem widget={WIDGET} value={["user-0000aaaa", "user-0000bbbb"]} onChange={onChange} />);

    await userEvent.click(screen.getAllByRole("button", { name: "Remove user" })[0]);

    expect(onChange).toHaveBeenCalledWith(["user-0000bbbb"]);
  });

  it("turns a legacy single id into a list", async () => {
    const onChange = vi.fn();
    render(<UsersWidgetItem widget={WIDGET} value={"user-0000aaaa" as unknown as string[]} onChange={onChange} />);

    await userEvent.click(screen.getByRole("combobox", { name: "Approvers" }));
    await userEvent.click(screen.getByRole("option", { name: /Bob/ }));

    expect(onChange).toHaveBeenCalledWith(["user-0000aaaa", "user-0000bbbb"]);
  });
});
