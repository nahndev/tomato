import { TemplateDocKey } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { readTemplateSnapshot } from "./read-template-snapshot";

describe("readTemplateSnapshot", () => {
  it("reads an empty doc as an empty state", () => {
    expect(readTemplateSnapshot(new Y.Doc())).toEqual({
      name: "",
      widgets: {},
      sessions: {},
      layouts: {},
      widgetToSession: {},
      links: {},
      behaviors: {},
    });
  });

  it("reads the name, and the records", () => {
    const doc = new Y.Doc();
    doc.getText(TemplateDocKey.NAME).insert(0, "Intake");
    doc.getMap(TemplateDocKey.SESSIONS).set("s1", { id: "s1", name: "Section 1" });

    const state = readTemplateSnapshot(doc);

    expect(state.name).toBe("Intake");
    expect(state.sessions).toEqual({ s1: { id: "s1", name: "Section 1" } });
  });
});
