import { WidgetType } from "@tomato/constants";
import { SessionValidationProvider, TemplateDataProvider } from "@/modules/template-data";
import type { Widget } from "@/shared/types/template.types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ButtonWidgetItem } from "./button-widget-item";

const submit: Widget = { id: "submit", type: WidgetType.SUBMIT_BUTTON, label: "Submit" };
const name: Widget = { id: "name", type: WidgetType.TEXT, label: "Name", required: true };

function renderButton(values: Record<string, unknown>) {
  render(
    <TemplateDataProvider widgets={{ name, submit }} links={{}} widgetToSession={{ name: "s1", submit: "s1" }} values={values}>
      <SessionValidationProvider sessionId="s1">
        <ButtonWidgetItem widget={submit} />
      </SessionValidationProvider>
    </TemplateDataProvider>,
  );
}

describe("ButtonWidgetItem", () => {
  it("is disabled and lists the errors by condition in a tooltip while a condition is not met", async () => {
    renderButton({});

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    await userEvent.hover(screen.getByRole("button", { name: "Submit" }).parentElement!);
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Required fields filled");
    expect(tooltip).toHaveTextContent("Name is required");
  });

  it("is enabled without a tooltip once the conditions are met", () => {
    renderButton({ name: "Ada" });

    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
