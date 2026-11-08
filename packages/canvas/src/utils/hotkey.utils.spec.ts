import { describe, expect, it } from "vitest";
import { formatHotkey } from "./hotkey.utils";

describe("formatHotkey", () => {
  it("shows letters, brackets and modifiers", () => {
    expect(formatHotkey("v", false)).toBe("V");
    expect(formatHotkey("bracketright", false)).toBe("]");
    expect(formatHotkey("shift+bracketleft", false)).toBe("Shift+[");
  });

  it("shows mod as Ctrl, or ⌘ on macOS", () => {
    expect(formatHotkey("mod+d", false)).toBe("Ctrl+D");
    expect(formatHotkey("mod+d", true)).toBe("⌘D");
  });
});
