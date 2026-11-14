import { ButtonConditionType, WidgetType } from "@tomato/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConditionsField } from "./conditions-field";

const checkbox = () => screen.getByRole("checkbox", { name: "Required fields filled" });

describe("ConditionsField", () => {
  it("adds a condition with empty meta, then removes it", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ConditionsField widgetId="b1" widgetType={WidgetType.BUTTON} value={undefined} onChange={onChange} />,
    );

    await userEvent.click(checkbox());
    expect(onChange).toHaveBeenLastCalledWith({ [ButtonConditionType.REQUIRED_FILLED]: {} });

    rerender(
      <ConditionsField
        widgetId="b1"
        widgetType={WidgetType.BUTTON}
        value={{ [ButtonConditionType.REQUIRED_FILLED]: {} }}
        onChange={onChange}
      />,
    );
    expect(checkbox()).toBeChecked();
    await userEvent.click(checkbox());
    expect(onChange).toHaveBeenLastCalledWith({});
  });

  it("locks the required condition of a submit button", () => {
    render(<ConditionsField widgetId="b1" widgetType={WidgetType.SUBMIT_BUTTON} value={undefined} onChange={vi.fn()} />);

    expect(checkbox()).toBeChecked();
    expect(checkbox()).toBeDisabled();
  });
});
