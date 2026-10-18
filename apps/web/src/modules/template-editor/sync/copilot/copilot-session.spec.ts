import { describe, expect, it } from "vitest";
import { EditorIconKey } from "../../template-editor.icons";
import { sessionPropertiesInput, toSessionPatch, toSessionProperties } from "./copilot-session";
import { editorStateToText } from "./copilot-widget-properties";

describe("sessionPropertiesInput", () => {
  it("accepts a persisted icon key", () => {
    expect(sessionPropertiesInput.safeParse({ name: "Contact", icon: EditorIconKey.CLOCK }).success).toBe(true);
  });

  it("rejects an unknown icon key", () => {
    expect(sessionPropertiesInput.safeParse({ name: "Contact", icon: "not-an-icon" }).success).toBe(false);
  });

  it("rejects a blank name", () => {
    expect(sessionPropertiesInput.safeParse({ name: "   " }).success).toBe(false);
  });
});

describe("toSessionProperties", () => {
  it("keeps only the given fields and trims the name", () => {
    expect(toSessionProperties({ name: "  Contact  " })).toEqual({ name: "Contact" });
  });

  it("turns the plain-text description into editor state", () => {
    const { description } = toSessionProperties({ name: "Contact", description: "Line 1\nLine 2" });

    expect(description && editorStateToText(description)).toBe("Line 1\nLine 2");
  });

  it("does not store an empty description", () => {
    expect(toSessionProperties({ name: "Contact", description: "" })).toEqual({ name: "Contact" });
  });
});

describe("toSessionPatch", () => {
  it("only carries the fields the model sent", () => {
    expect(toSessionPatch({ icon: EditorIconKey.CLOCK })).toEqual({ icon: EditorIconKey.CLOCK });
  });

  it("clears the description when it is an empty string", () => {
    expect(toSessionPatch({ description: "" })).toStrictEqual({ description: undefined });
  });

  it("returns an empty patch when nothing is given", () => {
    expect(toSessionPatch({})).toEqual({});
  });
});
