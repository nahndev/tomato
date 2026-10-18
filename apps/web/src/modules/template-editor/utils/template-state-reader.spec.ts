import { TemplateDocKey } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { readTemplateState } from "./template-state-reader";

describe("readTemplateState", () => {
  it("reads an empty doc as an empty state", () => {
    expect(readTemplateState(new Y.Doc())).toEqual({
      name: "",
      widgets: {},
      sessions: {},
      layouts: {},
      widgetToSession: {},
    });
  });

  it("reads the name, and the records", () => {
    const doc = new Y.Doc();
    doc.getText(TemplateDocKey.NAME).insert(0, "Intake");
    doc.getMap(TemplateDocKey.SESSIONS).set("s1", { id: "s1", name: "Section 1" });

    const state = readTemplateState(doc);

    expect(state.name).toBe("Intake");
    expect(state.sessions).toEqual({ s1: { id: "s1", name: "Section 1" } });
  });
});
