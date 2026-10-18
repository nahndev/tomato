import { TemplateDocKey } from "@tomato/constants";
import type { Session, SessionProperties } from "@tomato/types";
import { SyncHandler, type SyncDoc } from "@/shared/lib/sync";
import { DEFAULT_SESSION_ID, DEFAULT_SESSION_NAME } from "../../template-editor.constants";
import { SessionAddedEvent, SessionRemovedEvent, SessionUpdatedEvent } from "../sync.events";
import { LayoutHandler } from "./layout-handler";
import { WidgetHandler } from "./widget-handler";

@SyncHandler()
export class SessionHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  private get sessions() {
    return this.syncDoc.doc.getMap<Session>(TemplateDocKey.SESSIONS);
  }

  getSession(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  getOrCreateDefaultSessionId(): string {
    const existing = this.sessions.values().next().value as Session | undefined;
    if (existing) return existing.id;
    this.sessions.set(DEFAULT_SESSION_ID, { id: DEFAULT_SESSION_ID, name: DEFAULT_SESSION_NAME });
    return DEFAULT_SESSION_ID;
  }

  addSession(id: string, properties: SessionProperties): void {
    const session: Session = { id, ...properties };
    this.sessions.set(id, session);
    this.syncDoc.emit(new SessionAddedEvent(session));
  }

  updateSession(sessionId: string, patch: Partial<SessionProperties>): void {
    const current = this.sessions.get(sessionId);
    if (!current) return;
    this.sessions.set(sessionId, { ...current, ...patch });
    this.syncDoc.emit(new SessionUpdatedEvent(sessionId));
  }

  /** A template always keeps at least one session, so removing the last one is a no-op. */
  removeSession(sessionId: string): void {
    if (!this.sessions.has(sessionId)) return;
    if (this.sessions.size <= 1) return;

    const widgetHandler = this.syncDoc.getHandler(WidgetHandler);
    this.syncDoc
      .getHandler(LayoutHandler)
      .getWidgetIdsForSession(sessionId)
      .forEach((widgetId) => widgetHandler.removeWidget(widgetId));

    this.sessions.delete(sessionId);
    this.syncDoc.emit(new SessionRemovedEvent(sessionId));
  }
}
