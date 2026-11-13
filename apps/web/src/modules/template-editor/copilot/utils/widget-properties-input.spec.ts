import { WidgetType } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import { getMockOption, getMockWidget } from "../../testing/template.factory";
import { richTextStateToText } from "./rich-text";
import { toWidgetProperties } from "./widget-properties-input";

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

  it("turns plain content into rich text state", () => {
    const { content } = toWidgetProperties({ content: "Hello" });

    expect(content && richTextStateToText(content)).toBe("Hello");
  });
});
