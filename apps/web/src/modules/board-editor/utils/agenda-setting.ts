import type { Board, BoardAgendaSettingInput } from "@/modules/board";
import type { AgendaSettingDraft } from "../board-editor.types";

export function toAgendaSettingDrafts({ templates, agendaSetting }: Board): AgendaSettingDraft[] {
  return templates.map(({ templateId }) => {
    const setting = agendaSetting[templateId];
    return {
      templateId,
      titleWidget: setting?.titleWidget ?? null,
      startWidget: setting?.startWidget ?? null,
      endWidget: setting?.endWidget ?? null,
    };
  });
}

export function prepareAgendaSettings(drafts: AgendaSettingDraft[]): BoardAgendaSettingInput[] | null {
  const used = drafts.filter((draft) => [draft.titleWidget, draft.startWidget, draft.endWidget].some((widget) => widget !== null));
  return used.every((draft): draft is BoardAgendaSettingInput => draft.startWidget !== null) ? used : null;
}
