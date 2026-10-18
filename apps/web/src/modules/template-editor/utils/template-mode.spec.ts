import { describe, expect, it } from "vitest";
import { TemplateMode } from "../template-editor.constants";
import { resolveTemplateMode } from "./template-mode";

describe("resolveTemplateMode", () => {
  it("opens in edit mode by default", () => {
    expect(resolveTemplateMode(undefined)).toBe(TemplateMode.EDIT);
    expect(resolveTemplateMode("anything")).toBe(TemplateMode.EDIT);
  });

  it("opens in view mode only when asked", () => {
    expect(resolveTemplateMode("view")).toBe(TemplateMode.VIEW);
  });
});
