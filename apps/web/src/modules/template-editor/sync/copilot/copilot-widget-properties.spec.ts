import { ApiCallMethod, ApiCallResponseType, WidgetType } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import { getMockOption, getMockWidget } from "../../testing/template.factory";
import {
  describeWidget,
  editorStateToText,
  findUnknownWidgetIds,
  toEditorState,
  toWidgetProperties,
  widgetPropertiesInput,
} from "./copilot-widget-properties";

describe("editor state text conversion", () => {
  it("round-trips multi-line text", () => {
    expect(editorStateToText(toEditorState("Line 1\n\nLine 3"))).toBe("Line 1\n\nLine 3");
  });
});

describe("toWidgetProperties", () => {
  it("only returns the keys the model sent", () => {
    expect(toWidgetProperties({ label: "Name", required: true })).toEqual({ label: "Name", required: true });
  });

  it("builds ordered options with fresh keys", () => {
    const { options } = toWidgetProperties({ options: ["A", "B", "C"] });

    expect(options?.map((option) => option.value)).toEqual(["A", "B", "C"]);
    expect(new Set(options?.map((option) => option.key)).size).toBe(3);
    expect(options?.map((option) => option.index)).toEqual([...(options ?? [])].map((option) => option.index).sort());
  });

  it("keeps the key of an option whose text did not change", () => {
    const existing = getMockWidget({
      type: WidgetType.SELECT,
      options: [getMockOption({ key: "k-a", value: "A" }), getMockOption({ key: "k-b", value: "B" })],
    });

    const { options } = toWidgetProperties({ options: ["A", "Z"] }, existing);

    expect(options?.[0].key).toBe("k-a");
    expect(options?.[1].key).not.toBe("k-b");
  });

  it("turns plain content into editor state", () => {
    const { content } = toWidgetProperties({ content: "Hello" });

    expect(content && editorStateToText(content)).toBe("Hello");
  });

  it("gives api-call rows and mappings ids", () => {
    const { apiCall } = toWidgetProperties({
      apiCall: {
        method: ApiCallMethod.GET,
        url: "/users",
        params: [{ key: "q", source: "static", value: "x" }],
        response: { type: ApiCallResponseType.JSON, jsonMappings: [{ key: "data.name", widgetId: "w2" }] },
      },
    });

    expect(apiCall?.params[0].id).toEqual(expect.any(String));
    expect(apiCall?.response.jsonMappings?.[0].id).toEqual(expect.any(String));
  });
});

describe("findUnknownWidgetIds", () => {
  const widgets = { w1: getMockWidget({ id: "w1" }) };

  it("lists widget ids that are not in the template", () => {
    const input = widgetPropertiesInput.parse({
      apiCall: {
        method: ApiCallMethod.GET,
        url: "/x",
        params: [{ key: "a", source: "widget", widgetId: "w1" }],
        response: { type: ApiCallResponseType.IMAGE, imageWidgetId: "ghost" },
      },
    });

    expect(findUnknownWidgetIds(input, widgets)).toEqual(["ghost"]);
  });

  it("returns nothing without an api call", () => {
    expect(findUnknownWidgetIds({ label: "x" }, widgets)).toEqual([]);
  });
});

describe("describeWidget", () => {
  it("shows options as plain text in display order", () => {
    const widget = getMockWidget({
      type: WidgetType.SELECT,
      options: [getMockOption({ value: "Second", index: "b" }), getMockOption({ value: "First", index: "a" })],
    });

    expect(describeWidget(widget).options).toEqual(["First", "Second"]);
  });
});
