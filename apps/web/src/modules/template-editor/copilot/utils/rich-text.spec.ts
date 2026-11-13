import { describe, expect, it } from "vitest";
import { richTextStateToText, toRichTextState } from "./rich-text";

describe("rich text state conversion", () => {
  it("round-trips multi-line text", () => {
    expect(richTextStateToText(toRichTextState("Line 1\n\nLine 3"))).toBe("Line 1\n\nLine 3");
  });
});
