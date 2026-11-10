import { SessionConditionType, WidgetType } from "@tomato/constants";
import type { TemplateSnapshot } from "@tomato/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TemplateForm } from "./template-form";

const SNAPSHOT: TemplateSnapshot = {
  name: "Intake",
  widgets: {
    name: { id: "name", type: WidgetType.TEXT, label: "Full name" },
    notes: { id: "notes", type: WidgetType.TEXT, label: "Notes" },
  },
  layouts: {
    name: { column: 0, span: 4, idx: "a0" },
    notes: { column: 0, span: 4, idx: "a0" },
  },
  widgetToSession: { name: "s1", notes: "s2" },
  sessions: {
    s1: { id: "s1", name: "Basics" },
    s2: { id: "s2", name: "Details", condition: { type: SessionConditionType.WIDGET_HAS_VALUE, widgetId: "name" } },
  },
};

describe("TemplateForm", () => {
  it("shows a session only while its condition holds", () => {
    const { rerender } = render(<TemplateForm snapshot={SNAPSHOT} values={{}} onChange={vi.fn()} />);

    expect(screen.getByText("Basics")).toBeInTheDocument();
    expect(screen.queryByText("Details")).not.toBeInTheDocument();

    rerender(<TemplateForm snapshot={SNAPSHOT} values={{ name: "Ada" }} onChange={vi.fn()} />);

    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("renders the value of a widget and reports changes by widget id", async () => {
    const onChange = vi.fn();
    render(<TemplateForm snapshot={SNAPSHOT} values={{ name: "Ad" }} onChange={onChange} />);

    const input = screen.getByLabelText("Full name");
    expect(input).toHaveValue("Ad");

    await userEvent.type(input, "a");

    expect(onChange).toHaveBeenCalledWith("name", "Ada");
  });
});
