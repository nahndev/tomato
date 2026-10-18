import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TemplateStateContext } from "../../hooks/use-template-state";
import { getMockSession } from "../../testing/template.factory";
import type { TemplateState } from "../../template-editor.types";
import { SessionProvider } from "./session-provider";
import { SessionSettingPopup } from "./session-setting-popup";

const removeSession = vi.fn();
const updateSession = vi.fn();

vi.mock("../../sync/hooks/use-session-actions", () => ({
  useSessionActions: () => ({
    updateSession,
    removeSession,
    addSession: vi.fn(),
    updateLayout: vi.fn(),
    placeWidget: vi.fn(),
  }),
}));

function renderPopup(sessions: TemplateState["sessions"], sessionId: string) {
  const state: TemplateState = {
    name: "Template",
    widgets: {},
    layouts: {},
    widgetToSession: {},
    sessions,
  };

  render(
    <TemplateStateContext.Provider value={state}>
      <SessionProvider sessionId={sessionId}>
        <SessionSettingPopup />
      </SessionProvider>
    </TemplateStateContext.Provider>,
  );
}

async function openSettings() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /session settings/i }));
  return user;
}

describe("SessionSettingPopup - remove session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables the remove button when it is the only session", async () => {
    renderPopup({ s1: getMockSession({ id: "s1" }) }, "s1");

    await openSettings();

    expect(screen.getByRole("button", { name: /remove session/i })).toBeDisabled();
  });

  it("enables the remove button when other sessions exist", async () => {
    renderPopup({ s1: getMockSession({ id: "s1" }), s2: getMockSession({ id: "s2" }) }, "s2");

    await openSettings();

    expect(screen.getByRole("button", { name: /remove session/i })).toBeEnabled();
  });

  it("does not remove the session until the confirmation dialog is accepted", async () => {
    renderPopup({ s1: getMockSession({ id: "s1" }), s2: getMockSession({ id: "s2" }) }, "s2");
    const user = await openSettings();

    await user.click(screen.getByRole("button", { name: /remove session/i }));

    expect(removeSession).not.toHaveBeenCalled();
    expect(screen.getByRole("alertdialog", { name: /remove this session/i })).toBeInTheDocument();
  });

  it("removes the session once the destructive action is confirmed", async () => {
    renderPopup({ s1: getMockSession({ id: "s1" }), s2: getMockSession({ id: "s2" }) }, "s2");
    const user = await openSettings();

    await user.click(screen.getByRole("button", { name: /remove session/i }));
    const dialog = screen.getByRole("alertdialog", { name: /remove this session/i });
    await user.click(within(dialog).getByRole("button", { name: /remove session/i }));

    expect(removeSession).toHaveBeenCalledWith("s2");
  });

  it("does not remove the session when the confirmation is cancelled", async () => {
    renderPopup({ s1: getMockSession({ id: "s1" }), s2: getMockSession({ id: "s2" }) }, "s2");
    const user = await openSettings();

    await user.click(screen.getByRole("button", { name: /remove session/i }));
    const dialog = screen.getByRole("alertdialog", { name: /remove this session/i });
    await user.click(within(dialog).getByRole("button", { name: /cancel/i }));

    expect(removeSession).not.toHaveBeenCalled();
  });
});
