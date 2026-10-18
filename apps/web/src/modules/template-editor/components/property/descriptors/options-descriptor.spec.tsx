import { WidgetType } from "@tomato/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getMockOption } from "../../../testing/template.factory";
import { OptionsDescriptor } from "./options-descriptor";

describe("OptionsDescriptor", () => {
  it("renders one row per option, in index order", () => {
    const options = [
      getMockOption({ key: "b", value: "Second", index: "b" }),
      getMockOption({ key: "a", value: "First", index: "a" }),
    ];

    render(<OptionsDescriptor widgetId="w1" widgetType={WidgetType.SELECT} value={options} onChange={vi.fn()} />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual(["First", "Second"]);
  });

  it("keeps an option's key when its text is edited, so existing answers aren't orphaned", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const option = getMockOption({ key: "opt-1", value: "Old label" });

    render(<OptionsDescriptor widgetId="w1" widgetType={WidgetType.SELECT} value={[option]} onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "!");

    const next = onChange.mock.calls.at(-1)?.[0];
    expect(next).toHaveLength(1);
    expect(next[0].key).toBe("opt-1");
    expect(next[0].value).toBe("Old label!");
  });

  it("adds a new option with a fresh key after the last one", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const option = getMockOption({ key: "opt-1", value: "Only option" });

    render(<OptionsDescriptor widgetId="w1" widgetType={WidgetType.SELECT} value={[option]} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /add option/i }));

    const next = onChange.mock.calls.at(-1)?.[0];
    expect(next).toHaveLength(2);
    expect(next[0].key).toBe("opt-1");
    expect(next[1].key).not.toBe("opt-1");
    expect(next[1].value).toBe("");
    expect(next[1].index > next[0].index).toBe(true);
  });

  it("removes only the targeted option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const options = [
      getMockOption({ key: "opt-1", value: "Keep", index: "a" }),
      getMockOption({ key: "opt-2", value: "Remove", index: "b" }),
    ];

    render(<OptionsDescriptor widgetId="w1" widgetType={WidgetType.SELECT} value={options} onChange={onChange} />);
    await user.click(screen.getAllByRole("button", { name: /remove option/i })[1]);

    expect(onChange.mock.calls.at(-1)?.[0]).toEqual([expect.objectContaining({ key: "opt-1" })]);
  });
});
