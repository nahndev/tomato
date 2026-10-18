import { TemplateDocKey } from "@tomato/constants";
import type { GridLayout, Session, Widget } from "@tomato/types";
import type * as Y from "yjs";
import type { TemplateState } from "../template-editor.types";

export function readTemplateState(doc: Y.Doc): TemplateState {
  return {
    name: doc.getText(TemplateDocKey.NAME).toString(),
    widgets: Object.fromEntries(doc.getMap<Widget>(TemplateDocKey.WIDGETS).entries()),
    sessions: Object.fromEntries(doc.getMap<Session>(TemplateDocKey.SESSIONS).entries()),
    layouts: Object.fromEntries(doc.getMap<GridLayout>(TemplateDocKey.LAYOUTS).entries()),
    widgetToSession: Object.fromEntries(doc.getMap<string>(TemplateDocKey.WIDGET_TO_SESSION).entries()),
  };
}
