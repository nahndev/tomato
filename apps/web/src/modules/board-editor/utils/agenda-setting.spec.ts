import type { Board } from "@/modules/board";
import { describe, expect, it } from "vitest";
import type { AgendaSettingDraft } from "../board-editor.types";
import { prepareAgendaSettings, toAgendaSettingDrafts } from "./agenda-setting";

const TEMPLATE_A = "template-a";
const TEMPLATE_B = "template-b";

function draft(overrides: Partial<AgendaSettingDraft> = {}): AgendaSettingDraft {
  return { templateId: TEMPLATE_A, titleWidget: null, startWidget: null, endWidget: null, ...overrides };
}

describe("toAgendaSettingDrafts", () => {
  it("gives every linked template a draft, filled from its saved setting", () => {
    const board = {
      templates: [{ templateId: TEMPLATE_A }, { templateId: TEMPLATE_B }],
      agendaSetting: { [TEMPLATE_A]: { titleWidget: "w-title", startWidget: "w-start", endWidget: null } },
    } as unknown as Board;

    expect(toAgendaSettingDrafts(board)).toEqual([
      draft({ titleWidget: "w-title", startWidget: "w-start" }),
      draft({ templateId: TEMPLATE_B }),
    ]);
  });
});

describe("prepareAgendaSettings", () => {
  it("keeps the drafts with a start widget and drops the empty ones", () => {
    const ready = draft({ startWidget: "w-start", endWidget: "w-end" });

    expect(prepareAgendaSettings([ready, draft({ templateId: TEMPLATE_B })])).toEqual([ready]);
  });

  it("rejects a draft with a title or end widget but no start widget", () => {
    expect(prepareAgendaSettings([draft({ titleWidget: "w-title" })])).toBeNull();
    expect(prepareAgendaSettings([draft({ endWidget: "w-end" })])).toBeNull();
  });
});
