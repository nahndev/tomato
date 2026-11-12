import {
  LinkDeleteAction,
  LinkTargetType,
  SessionConditionType,
  SessionNestedType,
  WidgetType,
} from "@tomato/constants";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
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
  links: {},
};

const CANVAS_SNAPSHOT: TemplateSnapshot = {
  name: "Intake",
  widgets: {
    canvas: {
      id: "canvas",
      type: WidgetType.CANVAS,
      label: "Address",
      session: { id: "content", name: "Canvas content", nested: { type: SessionNestedType.WIDGET, uuid: "canvas" } },
    },
    street: { id: "street", type: WidgetType.TEXT, label: "Street" },
  },
  layouts: {
    canvas: { column: 0, span: 4, idx: "a0", isFullWidth: true },
    street: { column: 0, span: 4, idx: "a0" },
  },
  widgetToSession: { canvas: "s1", street: "content" },
  sessions: { s1: { id: "s1", name: "Basics" } },
  links: {},
};

const MIXED_VIEW_SNAPSHOT: TemplateSnapshot = {
  name: "Intake",
  widgets: {
    household: {
      id: "household",
      type: WidgetType.MIXED_VIEW,
      label: "Household",
      tabs: [
        { id: "owner", name: "Owner", nested: { type: SessionNestedType.WIDGET, uuid: "household" } },
        { id: "tenant", name: "Tenant", nested: { type: SessionNestedType.WIDGET, uuid: "household" } },
      ],
    },
    ownerName: { id: "ownerName", type: WidgetType.TEXT, label: "Owner name" },
    tenantName: { id: "tenantName", type: WidgetType.TEXT, label: "Tenant name" },
  },
  layouts: {
    household: { column: 0, span: 4, idx: "a0", isFullWidth: true },
    ownerName: { column: 0, span: 4, idx: "a0" },
    tenantName: { column: 0, span: 4, idx: "a0" },
  },
  widgetToSession: { household: "s1", ownerName: "owner", tenantName: "tenant" },
  sessions: { s1: { id: "s1", name: "Basics" } },
  links: {},
};

const REPEAT_VIEW_SNAPSHOT: TemplateSnapshot = {
  name: "Intake",
  widgets: {
    room: {
      id: "room",
      type: WidgetType.SELECT,
      label: "Room",
      options: [
        { key: "kitchen", value: "Kitchen", index: "a1" },
        { key: "bedroom", value: "Bedroom", index: "a0" },
      ],
    },
    rooms: {
      id: "rooms",
      type: WidgetType.REPEAT_VIEW,
      label: "Rooms",
      session: { id: "content", name: "Rooms", nested: { type: SessionNestedType.WIDGET, uuid: "rooms" } },
    },
    area: { id: "area", type: WidgetType.TEXT, label: "Area" },
  },
  layouts: {
    room: { column: 0, span: 4, idx: "a0" },
    rooms: { column: 0, span: 4, idx: "a1", isFullWidth: true },
    area: { column: 0, span: 4, idx: "a0" },
  },
  widgetToSession: { room: "s1", rooms: "s1", area: "content" },
  sessions: { s1: { id: "s1", name: "Basics" } },
  links: {
    rooms: { [LinkTargetType.WIDGET]: { type: LinkTargetType.WIDGET, uuid: "room", onDelete: LinkDeleteAction.CASCADE } },
  },
};

/** Reports a width on observe, so the canvas can size its grid. */
class MeasuringResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}
  observe() {
    this.callback([{ contentRect: { width: 760, height: 40 } } as ResizeObserverEntry], this as never);
  }
  unobserve() {}
  disconnect() {}
}

afterEach(() => {
  vi.unstubAllGlobals();
});

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

    expect(onChange).toHaveBeenCalledWith("name", "Ada", ["name"]);
  });

  it("renders a canvas's widgets inside the canvas, not as a section", async () => {
    vi.stubGlobal("ResizeObserver", MeasuringResizeObserver);
    const onChange = vi.fn();
    render(<TemplateForm snapshot={CANVAS_SNAPSHOT} values={{}} onChange={onChange} />);

    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.queryByText("Canvas content")).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Street"), "M");

    expect(onChange).toHaveBeenCalledWith("street", "M", ["street"]);
  });

  it("renders every tab of a mixed view, each widget's value under its tab's scope", async () => {
    vi.stubGlobal("ResizeObserver", MeasuringResizeObserver);
    const onChange = vi.fn();
    render(
      <TemplateForm
        snapshot={MIXED_VIEW_SNAPSHOT}
        values={{ "household.tenant.tenantName": "Bob" }}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole("tab", { name: "Owner" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tenant" })).toBeInTheDocument();
    expect(screen.getByLabelText("Tenant name")).toHaveValue("Bob");

    await userEvent.type(screen.getByLabelText("Owner name"), "A");

    expect(onChange).toHaveBeenCalledWith("household.owner.ownerName", "A", ["household", "owner", "ownerName"]);
  });

  it("renders one tab per linked widget option, each with the repeat view's widgets under the option's scope", async () => {
    vi.stubGlobal("ResizeObserver", MeasuringResizeObserver);
    const onChange = vi.fn();
    render(<TemplateForm snapshot={REPEAT_VIEW_SNAPSHOT} values={{ "rooms.kitchen.area": "12" }} onChange={onChange} />);

    const tabs = screen.getAllByRole("tab").map((tab) => tab.textContent);
    expect(tabs).toEqual(["Bedroom", "Kitchen"]);

    const [bedroomArea, kitchenArea] = screen.getAllByDisplayValue((_, element) => element?.id === "area");
    expect(bedroomArea).toHaveValue("");
    expect(kitchenArea).toHaveValue("12");

    await userEvent.type(bedroomArea, "9");

    expect(onChange).toHaveBeenCalledWith("rooms.bedroom.area", "9", ["rooms", "bedroom", "area"]);
  });
});
